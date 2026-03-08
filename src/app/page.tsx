'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('hello-world')
  return (
    <div className="min-h-screen bg-white">
      <Header />
    </div>
  )
}
