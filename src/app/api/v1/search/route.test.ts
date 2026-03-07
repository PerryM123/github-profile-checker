import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe('GET /api/v1/search', () => {
  it('qパラメータが無いと400ステータスと正しいerror_messageを返却する', async () => {
    const req = new Request('http://localhost/api/v1/search')
    const response = await GET(req)
    const body = await response.json()
    expect(response.status).toBe(400)
    expect(body.error_message).toBe('qのパラメータは足りてません')
  })
  it('pageパラメータが不正な場合は400ステータスと正しいerror_messageを返却する', async () => {
    const req = new Request('http://localhost/api/v1/search?q=react&page=0')
    const response = await GET(req)
    const body = await response.json()
    expect(response.status).toBe(400)
    expect(body.error_message).toBe('pageパラメータが不正です')
  })
  it('Github外部APIが200レスポンスを返却すると200ステータスと検索結果を返却する', async () => {
    mockFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          total_count: 150,
          incomplete_results: false,
          items: [
            {
              name: 'repo-1',
              owner: {
                login: 'owner-1',
                avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
              },
            },
            {
              name: 'repo-2',
              owner: {
                login: 'owner-2',
                avatar_url: 'https://avatars.githubusercontent.com/u/69632?v=4',
              },
            },
          ],
        }),
        { status: 200 }
      )
    )
    const req = new Request('http://localhost/api/v1/search?q=react&page=1')
    const response = await GET(req)
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.total_count).toBe(150)
    expect(body.total_pages).toBe(5)
    expect(body.result).toEqual([
      {
        avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
        repository_name: 'repo-1',
        owner_name: 'owner-1',
      },
      {
        avatar_url: 'https://avatars.githubusercontent.com/u/69632?v=4',
        repository_name: 'repo-2',
        owner_name: 'owner-2',
      },
    ])
  })
  it('total_countが1000を超える場合でもtotal_pagesは1000件分を上限に計算される', async () => {
    mockFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          total_count: 1500,
          incomplete_results: false,
          items: [
            {
              name: 'repo-1',
              owner: {
                login: 'owner-1',
                avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
              },
            },
          ],
        }),
        { status: 200 }
      )
    )
    const req = new Request('http://localhost/api/v1/search?q=react&page=1')
    const response = await GET(req)
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.total_count).toBe(1500)
    expect(body.total_pages).toBe(34)
  })

  it('Github外部APIがエラーを返却すると500ステータスと正しいerror_messageを返却する', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Internal error' }), {
        status: 500,
      })
    )
    const req = new Request('http://localhost/api/v1/search?q=react&page=1')
    const response = await GET(req)
    const body = await response.json()
    expect(response.status).toBe(500)
    expect(body.error_message).toBe('Internal error')
  })
})
