type GithubErrorPayload = {
  message?: string
  documentation_url?: string
}

export type GithubFetchError = {
  status: number
  message: string
  documentation_url?: string
}

export async function githubFetch<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
  // TODO: 動作確認必須。cache作戦は検討中！vercelなら{revalidate: 60}などでもいける気がする
  const res = await fetch(url, { headers, cache: 'no-store' })
  if (!res.ok) {
    let payload: GithubErrorPayload | undefined
    try {
      payload = (await res.json()) as GithubErrorPayload
    } catch {
      // TODO: エラーハンドリングは検討中
      // TODO: log出力も必要。pinoにしようかな
    }
    const err: GithubFetchError = {
      status: res.status,
      message: payload?.message ?? `GitHub API request failed (${res.status})`,
      documentation_url: payload?.documentation_url,
    }
    throw err
  }
  return (await res.json()) as T
}
