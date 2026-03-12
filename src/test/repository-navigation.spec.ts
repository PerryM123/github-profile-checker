import { test, expect } from '@playwright/test'

test('ホームページからリポジトリを検索し、リポジトリ詳細ページまで問題なく遷移することができる', async ({
  page,
}) => {
  await test.step('ホームページを開く', async () => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: 'Githubリポジトリを検索しましょう' })
    ).toBeVisible()
  })
  await test.step('Reactリポジトリを検索', async () => {
    await page.getByRole('textbox', { name: 'リポジトリ検索' }).click()
    await page.getByRole('textbox', { name: 'リポジトリ検索' }).fill('react')
    await page.getByRole('button', { name: '検索' }).click()
    await page
      .getByRole('link', { name: 'facebook facebook/react', exact: true })
      .click()
  })
  await test.step('Reactのリポジトリ詳細を確認', async () => {
    await expect(page.getByText('JavaScript')).toBeVisible()
    await expect(page.getByText('スター')).toBeVisible()
    await expect(page.getByText('ウォッチャー')).toBeVisible()
    await expect(page.getByText('フォーク')).toBeVisible()
    await expect(page.getByText('オープンイシュー')).toBeVisible()
    await expect(page.getByRole('link', { name: 'GitHubで見る' })).toBeVisible()
  })
  await test.step('リポジトリ詳細からホームページへ戻る', async () => {
    await page.getByRole('link', { name: '検索ページに戻る' }).click()
    await expect(
      page.getByRole('heading', { name: 'Githubリポジトリを検索しましょう' })
    ).toBeVisible()
  })
})
