import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe('GET /api/v1/:owner_name/:repo_name', () => {
  it('なぜか不正なパラメータが渡されると400と正しいerror_messageを返却する', async () => {
    const ownerName = ' '
    const repoName = ' '
    const req = new Request(`http://localhost/api/v1/${ownerName}/${repoName}`)
    const response = await GET(req, {
      params: Promise.resolve({
        owner_name: ownerName,
        repo_name: repoName,
      }),
    })
    const body = await response.json()
    expect(response.status).toBe(400)
    expect(body.error_message).toBe('owner_name または repo_name が不正です')
  })
  it('Github外部APIが404レスポンスを返却すると404と正しいerror_messageを返却する', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Internal error' }), {
        status: 404,
      })
    )
    const ownerName = 'some-owner'
    const repoName = 'some-repo'
    const req = new Request(`http://localhost/api/v1/${ownerName}/${repoName}`)
    const response = await GET(req, {
      params: Promise.resolve({
        owner_name: ownerName,
        repo_name: repoName,
      }),
    })
    const body = await response.json()
    expect(response.status).toBe(404)
    expect(body.error_message).toBe(
      'owner_name または repo_name は存在しません'
    )
  })
  it('Github外部APIが500レスポンスを返却すると500と正しいerror_messageを返却する', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Internal error' }), {
        status: 500,
      })
    )
    const ownerName = 'some-owner'
    const repoName = 'some-repo'
    const req = new Request(`http://localhost/api/v1/${ownerName}/${repoName}`)
    const response = await GET(req, {
      params: Promise.resolve({
        owner_name: ownerName,
        repo_name: repoName,
      }),
    })
    const body = await response.json()
    expect(response.status).toBe(500)
    expect(body.error_message).toBe('Internal error')
  })
})
