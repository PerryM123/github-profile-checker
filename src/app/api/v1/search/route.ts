import { NextResponse } from 'next/server'
import { githubFetch, type GithubFetchError } from '@/lib/github'
import { STATUS_CODE } from '@/app/constants'
import { logApiError, logApiWarn } from '@/lib/logger'

type GithubSearchResponse = {
  total_count: number
  incomplete_results: boolean
  items: Array<{
    name: string
    owner: { login: string; avatar_url: string }
  }>
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const pageParam = searchParams.get('page')
  if (!q) {
    logApiWarn('検索クエリ q パラメータが指定されていません')
    return NextResponse.json(
      { error_message: 'qのパラメータは足りてません' },
      { status: STATUS_CODE.BAD_REQUEST }
    )
  }
  const page = pageParam ? Number(pageParam) : 1
  if (Number.isNaN(page) || !Number.isFinite(page) || page < 1) {
    logApiWarn('page パラメータのバリデーションに失敗しました', {
      q,
      page: pageParam,
      url: req.url,
    })
    return NextResponse.json(
      { error_message: 'pageパラメータが不正です' },
      { status: STATUS_CODE.BAD_REQUEST }
    )
  }
  const perPage = 30
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    q
  )}&page=${page}&per_page=${perPage}`
  try {
    const data = await githubFetch<GithubSearchResponse>(url)
    const effectiveTotalCount = Math.min(data.total_count, 1000)
    const totalPages = Math.ceil(effectiveTotalCount / perPage)
    return NextResponse.json(
      {
        total_pages: totalPages,
        total_count: data.total_count,
        result: data.items.map((repo) => ({
          avatar_url: repo.owner.avatar_url,
          repository_name: repo.name,
          owner_name: repo.owner.login,
        })),
      },
      { status: STATUS_CODE.OK }
    )
  } catch (error) {
    const err = error as Partial<GithubFetchError>
    logApiError('GitHub 検索APIリクエストが失敗しました', error, {
      url,
      status: err.status,
    })
    return NextResponse.json(
      { error_message: err.message ?? '予期せぬエラーが発生しました' },
      { status: STATUS_CODE.INTERNAL_SERVER_ERROR }
    )
  }
}
