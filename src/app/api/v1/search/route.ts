import { NextResponse } from 'next/server'
import { githubFetch, type GithubFetchError } from '@/lib/github'

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
    return NextResponse.json(
      { error_message: 'qのパラメータは足りてません' },
      { status: 400 }
    )
  }

  const page = pageParam ? Number(pageParam) : 1
  if (Number.isNaN(page) || !Number.isFinite(page) || page < 1) {
    return NextResponse.json(
      { error_message: 'pageパラメータが不正です' },
      { status: 400 }
    )
  }

  const perPage = 30
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    q
  )}&page=${page}&per_page=${perPage}`

  try {
    const data = await githubFetch<GithubSearchResponse>(url)

    // GitHub Search API caps total_count effectively at 1000 for pagination.
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
      { status: 200 }
    )
  } catch (e) {
    const err = e as Partial<GithubFetchError>
    return NextResponse.json(
      { error_message: err.message ?? 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
