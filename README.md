# Github Profile Checker

## Demo Link

https://github-profile-checker-two.vercel.app/

![alt text](/docs/images/features.gif)

## API仕様書

https://github-profile-checker-two.vercel.app/api-doc

## 機能一覧

- リポジトリ検索
- リポジトリ詳細閲覧

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

- フォーマッター: Oxfmt
- リンター: ESlint
- コード品質を担保するツール: Huskyのpre-commitとpre-push

### インフラ、デプロイ先など

- **Frontend Hosting:** Vercel
- **CI/CD:** GitHub Actions

## プルリクまとめ

1. [Next.jsと必要なパッケージを導入](https://github.com/PerryM123/github-profile-checker/pull/1)
1. [サーバサイドの実装とAPI仕様書の作成（単体テストも含め）](https://github.com/PerryM123/github-profile-checker/pull/2)
1. [フロント側でページ作成](https://github.com/PerryM123/github-profile-checker/pull/3)
1. [Playwrightを導入し、E2Eテストを書く](https://github.com/PerryM123/github-profile-checker/pull/4)
1. [本番リリースできるようにCICDパイプラインを追加](https://github.com/PerryM123/github-profile-checker/pull/5)
1. [E2Eテストで見つかったバグを解消](https://github.com/PerryM123/github-profile-checker/pull/6)
1. [README更新](https://github.com/PerryM123/github-profile-checker/pull/7)

## Setup

## セットアップの事前準備

### nvm

このプロジェクトはnvm（Node Version Manager）でnodeバージョンを管理してるので必ずnvmを使って固定となったnodeバージョンをインストールしていただければと思います。

未導入の方へ[[Qiita] nvm(Node Version Manager)を使ってNode.jsをインストールする手順](https://qiita.com/ffggss/items/94f1c4c5d311db2ec71a)の記事を参考してください。

### env

ローカル環境を起動するには`.env`ファイルを用意する必要あり、`.env.example`をコピーし、`.env`のファイル名に変更し、GITHUB_TOKENを記入してください。GITHUB_TOKENの発行方法は以下です。
参考: [[Qiita] GitHub の fine-grained personal access token (PAT) の発行](https://qiita.com/Tomoki-Saito/items/7413482519363e269064)

## ローカル環境構築

```sh
$ cd github-profile-checker
$ pnpm i
$ pnpm run dev
```

ローカル環境のリンク先: http://localhost:3000/

## 工夫した点・拘ったポイント

### プロダクション品質を意識した実装

- **エラーハンドリング**: API呼び出し時のエラーを適切にキャッチし、ユーザーフレンドリーなエラーメッセージを表示
- **サーバーサイドのログ出力**: サーバーサイドでのエラーや警告をログに記録し、デバッグを容易に
- **バリデーション**: APIルートで入力パラメータのバリデーションを実装し、不正なリクエストを早期に検出
- **型安全性**: TypeScriptを活用し、コンパイル時にエラーを検出

### UXの向上

- **無限スクロール**: Intersection Observer APIを使用し、ページネーションよりもスムーズなユーザ体験を提供
- **ローディング状態**: 検索中と追加読み込み中で異なるローディングインジケーターを表示
- **レスポンシブデザイン**: モバイルからデスクトップまで快適に使用できるUI
- **エラー表示**: エラー発生時に明確なメッセージとアクションを提示

### テスト戦略

- **単体テスト・結合テスト**: Vitestを使用し、APIルートとコンポーネントの動作を保証
- **E2Eテスト**: Playwrightで実際のユーザーフローをテストし、回帰を防止
- **CI/CD**: GitHub Actionsでデプロイする直前に単体・結合・E2Eテストを実行

### コード品質＆開発体験

- **ドキュメンテーション**: どんなエンドポイントが提供されてるか分かるようにAPI仕様書を追加
- **Pre-commit/Pre-pushフック**: Huskyを使用し、コミット前にリンターとフォーマッターを実行
- **コードを統一**: 開発しやすい環境にするようにOxfmtとESLint

## AI利用レポートについて

主にCursorのAsk・Agentモードを利用しつつ開発しました。LLMのハルシネーションを避けるため、最優先できちんとテストとAPI仕様書を作成し、僕はどういうものを作ってるかAIが把握してくれるように開発を進めました。
