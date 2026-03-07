import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import repoDetailsSample200Response from '@/tests/fixtures/github-repo-details-api/200-github-repo-details-response.json'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe('GET /api/v1/:owner_name/:repo_name', () => {
  it('Github外部APIが200レスポンスを返却すると200ステータスとリポジトリ情報を返却する', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => repoDetailsSample200Response,
    })
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
    expect(response.status).toBe(200)
    console.log('perry: body: ', body)
    expect(body.avatar_url).toBe(
      'https://avatars.githubusercontent.com/u/69631?v=4'
    )
    expect(body.language).toBe('JavaScript')

    expect(body.repository_info.star_count).toBe(243691)
    expect(body.repository_info.watcher_count).toBe(243691)
    expect(body.repository_info.fork_count).toBe(50666)
    expect(body.repository_info.issues_count).toBe(1148)
  })
  it('なぜか不正なパラメータが渡されると400ステータスと正しいerror_messageを返却する', async () => {
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
  it('Github外部APIが404レスポンスを返却すると404ステータスと正しいerror_messageを返却する', async () => {
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
  it('Github外部APIが500レスポンスを返却すると500ステータスと正しいerror_messageを返却する', async () => {
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
