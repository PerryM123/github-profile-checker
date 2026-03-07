# Github Profile Checker

## Demo Link

TODO

## Main Features

### TODO①

TODO

### TODO②

TODO

### TODO③

TODO

## プロジェクト概要

### 技術スタック

**フロント**

- Next.js
- Tailwind CSS (レスポンシブ対応)

**テスト**

- Vitest (単体テスト、結合テスト)
- Playwright (E2Eテスト)

**外部API**

- Github API (参考: [リポジトリの REST API エンドポイント](https://docs.github.com/ja/rest/repos/repos))

**その他**

- フォーマッター: Prettier
- リンター: ESlint
- コード品質を担保するツール: Huskyのpre-commitとpre-push

### インフラ、デプロイ先など

- **Frontend Hosting:** Vercel
- **CI/CD:** GitHub Actions

## Pull Request Overview For This Assignment

1. TODO
1. TODO
1. TODO

## Setup

## セットアップの事前準備

### nvm

このプロジェクトはnvm（Node Version Manager）でnodeバージョンを管理してるので必ずnvmを使って固定となったnodeバージョンをインストールしていただければと思います。未導入の方へ[[Qiita] nvm(Node Version Manager)を使ってNode.jsをインストールする手順](https://qiita.com/ffggss/items/94f1c4c5d311db2ec71a)の記事を参考してください。

### env

ローカル環境を起動するには`.env`ファイルを用意する必要あり、`.env.example`をコピーし、`.env`のファイル名に変更し、GITHUB_TOKENを記入してください。GITHUB_TOKENの発行方法は以下です。
参考: [[Qiita] GitHub の fine-grained personal access token (PAT) の発行](https://qiita.com/Tomoki-Saito/items/7413482519363e269064)

## ローカル環境構築

```sh
$ cd github-profile-checker
$ pnpm i
$ pnpm run dev
```

リンク先: http://localhost:3000/
