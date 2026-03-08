'use client'

import { useState } from 'react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('hello-world')
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-black">
                GITHUB REPO SEARCH
              </h1>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
