import Image from 'next/image'
import Link from '@/app/components/Link'
import Button from '@/app/components/Button'

type RepositoryDetails = {
  avatar_url: string
  language: string
  repository_info: {
    star_count: number
    watcher_count: number
    fork_count: number
    issues_count: number
  }
  error_message?: string
}

export default async function RepositoryDetailsPage({
  params,
}: {
  params: Promise<{ owner_name: string; repo_name: string }>
}) {
  const { owner_name, repo_name } = await params
  const owner = owner_name
  const repo = repo_name

  if (!owner || !repo) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <div className="w-full max-w-2xl text-center">
          <div className="rounded-lg bg-red-50 p-6 text-red-800">
            <h2 className="mb-2 text-xl font-semibold">エラー</h2>
            <p className="mb-4">
              owner または repo パラメータが指定されていません
            </p>
            <Button href="/" variant="link">
              検索ページに戻る
            </Button>
          </div>
        </div>
      </div>
    )
  }

  let details: RepositoryDetails | null = null
  let error: string | null = null

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/v1/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      { cache: 'no-store' }
    )
    const data: RepositoryDetails = await res.json()
    console.log('perry: data: ', data)
    if (!res.ok || data.error_message) {
      error = data.error_message || 'リポジトリ情報の取得に失敗しました'
      details = null
    } else {
      details = data
    }
  } catch {
    error = '予期せぬエラーが発生しました'
    details = null
  }

  console.log('perry: before render: ', {
    error,
    details,
  })
  if (error || !details) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <div className="w-full max-w-2xl text-center">
          <div className="rounded-lg bg-red-50 p-6 text-red-800">
            <h2 className="mb-2 text-xl font-semibold">エラー</h2>
            <p className="mb-4">
              {error || 'リポジトリ情報を取得できませんでした'}
            </p>
            <Button href="/" variant="link">
              検索ページに戻る
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          検索ページに戻る
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center">
            <Image
              src={details.avatar_url}
              alt={owner || 'Owner'}
              width={64}
              height={64}
              className="mr-4 h-16 w-16 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {owner}/{repo}
              </h1>
              {details.language && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2 inline-block h-3 w-3 rounded-full bg-blue-500"></span>
                  <span className="text-gray-600">{details.language}</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm text-gray-600">スター</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {details.repository_info.star_count.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm text-gray-600">ウォッチャー</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {details.repository_info.watcher_count.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm text-gray-600">フォーク</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {details.repository_info.fork_count.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm text-gray-600">オープンイシュー</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {details.repository_info.issues_count.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              href={`https://github.com/${owner}/${repo}`}
              variant="link"
              className="inline-flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHubで見る
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
