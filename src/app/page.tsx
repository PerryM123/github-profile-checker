'use client'

import { useState } from 'react'
import Image from 'next/image'

type Repository = {
  avatar_url: string
  repository_name: string
  owner_name: string
}

type SearchResponse = {
  total_pages: number
  total_count: number
  result: Repository[]
  error_message?: string
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([])
      setError(null)
      setTotalCount(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/v1/search?q=${encodeURIComponent(searchQuery.trim())}`
      )
      const data: SearchResponse = await res.json()
      if (!res.ok || data.error_message) {
        setError(data.error_message || '検索に失敗しました')
        setResults([])
        setTotalCount(null)
      } else {
        setResults(data.result || [])
        setTotalCount(data.total_count)
      }
    } catch {
      setError('予期せぬエラーが発生しました')
      setResults([])
      setTotalCount(null)
    } finally {
      setLoading(false)
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  return (
    <div>
      <main className="relative min-h-[calc(100vh-80px)]">
        <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center px-6 py-20">
          <h2 className="mb-12 text-center text-5xl font-bold md:text-6xl">
            Githubリポジトリを検索しましょう
          </h2>
          <div className="w-full max-w-4xl">
            <div className="flex items-center rounded-lg p-2 shadow-2xl">
              <div className="flex flex-1 items-center px-4">
                <svg
                  className="mr-3 h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="リポジトリ検索"
                  className="flex-1 text-lg text-gray-800 placeholder-gray-400 outline-none"
                />
                {loading && (
                  <svg
                    className="ml-3 h-5 w-5 animate-spin text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
                {error}
              </div>
            )}

            {totalCount !== null && !error && (
              <div className="mt-4 text-sm text-gray-600">
                {totalCount.toLocaleString()}件のリポジトリが見つかりました
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-6 space-y-3">
                {results.map((repo, index) => (
                  <a
                    key={`${repo.owner_name}-${repo.repository_name}-${index}`}
                    href={`/repository-details?owner=${encodeURIComponent(
                      repo.owner_name
                    )}&repo=${encodeURIComponent(repo.repository_name)}`}
                    className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Image
                      src={repo.avatar_url}
                      alt={repo.owner_name}
                      width={48}
                      height={48}
                      className="mr-4 h-12 w-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {repo.owner_name}/{repo.repository_name}
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
