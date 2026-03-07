import { NextResponse } from 'next/server'
import { githubFetch, type GithubFetchError } from '@/lib/github'
import { STATUS_CODE } from '@/app/constants'
import { logApiError, logApiWarn } from '@/lib/logger'

type GithubRepoResponse = {
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  owner: { avatar_url: string }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ owner_name: string; repo_name: string }> }
) {
  const { owner_name, repo_name } = await params

  if (!owner_name?.trim() || !repo_name?.trim()) {
    logApiWarn('owner_name または repo_name のバリデーションに失敗しました', {
      owner_name,
      repo_name,
    })
    return NextResponse.json(
      { error_message: 'owner_name または repo_name が不正です' },
      { status: STATUS_CODE.BAD_REQUEST }
    )
  }

  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner_name
  )}/${encodeURIComponent(repo_name)}`

  try {
    const data = await githubFetch<GithubRepoResponse>(url)
    return NextResponse.json(
      {
        avatar_url: data.owner.avatar_url,
        language: data.language ?? '',
        repository_info: {
          star_count: data.stargazers_count,
          watcher_count: data.watchers_count,
          fork_count: data.forks_count,
          issues_count: data.open_issues_count,
        },
      },
      { status: STATUS_CODE.OK }
    )
  } catch (error) {
    const err = error as Partial<GithubFetchError>
    if (err.status === STATUS_CODE.NOT_FOUND) {
      logApiWarn('GitHubリポジトリが見つかりません', {
        owner_name,
        repo_name,
      })
      return NextResponse.json(
        { error_message: 'owner_name または repo_name は存在しません' },
        { status: STATUS_CODE.NOT_FOUND }
      )
    }

    logApiError('予期せぬエラーが発生しました', error, {
      url,
      status: err.status,
    })
    return NextResponse.json(
      { error_message: err.message ?? '予期せぬエラーが発生しました' },
      { status: STATUS_CODE.INTERNAL_SERVER_ERROR }
    )
  }
}
