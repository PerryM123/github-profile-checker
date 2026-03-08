'use client'

import { useState } from 'react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
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
                  placeholder="リポジトリ検索"
                  className="flex-1 text-lg text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
