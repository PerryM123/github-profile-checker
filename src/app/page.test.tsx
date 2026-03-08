import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
} as unknown as typeof IntersectionObserver

describe('Search Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  afterEach(() => {
    cleanup()
  })
  it('検索inputは空文字の場合、検索ボタンは非活性になる', async () => {
    const user = userEvent.setup()
    render(<Home />)
    const searchButton = screen.getByText('検索')
    expect(searchButton).toBeDisabled()
    const input = screen.getByPlaceholderText('リポジトリ検索')
    await user.type(input, 'react')
    expect(searchButton).toBeEnabled()
    await user.clear(input)
    expect(searchButton).toBeDisabled()
  })
  it('検索ボタンを押下し200レスポンスの場合、リポジトリ名などはrenderされる', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total_count: 2,
        total_pages: 1,
        result: [
          {
            owner_name: 'facebook',
            repository_name: 'react',
            avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
          },
        ],
      }),
    })
    render(<Home />)
    const input = screen.getByPlaceholderText('リポジトリ検索')
    await user.type(input, 'react')
    await user.click(screen.getByText('検索'))
    await waitFor(() => {
      expect(screen.getByText('facebook/react')).toBeInTheDocument()
    })
  })
  it('結果件数は0の場合は「0件のリポジトリが見つかりました」の文言が表示される', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total_pages: 0, total_count: 0, result: [] }),
    })
    render(<Home />)
    const input = screen.getByPlaceholderText('リポジトリ検索')
    await user.type(input, 'react_iudhgdiuhifdygisdyfygsdfgsdigfsiygf')
    await user.click(screen.getByText('検索'))
    await waitFor(() => {
      expect(
        screen.getByText('0件のリポジトリが見つかりました')
      ).toBeInTheDocument()
    })
  })
  it('APIがエラーを返した場合、エラーメッセージが表示される', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error_message: 'APIエラーが発生しました',
      }),
    })
    render(<Home />)
    const input = screen.getByPlaceholderText('リポジトリ検索')
    await user.type(input, 'react')
    await user.click(screen.getByText('検索'))
    await waitFor(() => {
      expect(screen.getByText('APIエラーが発生しました')).toBeInTheDocument()
    })
    // エラー時は結果が表示されないことを確認
    expect(screen.queryByText('facebook/react')).not.toBeInTheDocument()
  })
})
