import { NextResponse } from 'next/server'
import { githubFetch, type GithubFetchError } from '@/lib/github'
import { STATUS_CODE } from '@/app/constants'

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
  } catch (e) {
    const err = e as Partial<GithubFetchError>

    if (err.status === 404) {
      return NextResponse.json(
        { error_message: 'owner_name または repo_name が不正です' },
        { status: STATUS_CODE.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      { error_message: err.message ?? 'An unexpected error occurred' },
      { status: STATUS_CODE.INTERNAL_SERVER_ERROR }
    )
  }
}
