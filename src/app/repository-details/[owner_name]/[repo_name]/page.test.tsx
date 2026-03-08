import { it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import RepositoryDetailsPage from '@/app/repository-details/[owner_name]/[repo_name]/page'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

it('リポジトリ詳細ページが正しく表示される', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
      language: 'JavaScript',
      repository_info: {
        star_count: 200000,
        watcher_count: 5000,
        fork_count: 40000,
        issues_count: 100,
      },
    }),
  })

  const mockParams = Promise.resolve({
    owner_name: 'facebook',
    repo_name: 'react',
  })
  render(await RepositoryDetailsPage({ params: mockParams }))

  await waitFor(() => {
    expect(screen.getByText('facebook/react')).toBeInTheDocument()
  })

  expect(screen.getByText('JavaScript')).toBeInTheDocument()
  expect(screen.getByText('200,000')).toBeInTheDocument()
  expect(screen.getByText('5,000')).toBeInTheDocument()
  expect(screen.getByText('40,000')).toBeInTheDocument()
  expect(screen.getByText('100')).toBeInTheDocument()
  expect(screen.getByText('検索ページに戻る')).toBeInTheDocument()
})
