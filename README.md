# FUREQ 公式サイト

Astro（static）+ Tailwind CSS v4 + React。GitHub Pages に自動デプロイします。

## 1. 画像

`public/` に配置済みです。差し替える場合は同じファイル名で上書きしてください。

| ファイル | 用途 | サイズ |
| --- | --- | --- |
| `public/logo.png` | ヒーロー・フッターのロゴ | 2172 × 724 |
| `public/icon.png` | ファビコン・ヘッダーアイコン | 400 × 400 |
| `public/ogp-image.png` | SNS 共有時のサムネイル | 1200 × 630 |

## 2. ローカルで動かす

### Windows（バッチファイル）

| ファイル | 内容 |
| --- | --- |
| `setup.bat` | Node.js の確認、`npm install`、`.env` の作成、`public/` の画像チェック |
| `dev.bat` | 開発サーバーを起動してブラウザを開く（`node_modules` がなければ先に setup を実行） |
| `build.bat` | 静的サイトを `dist/` に書き出す |
| `preview.bat` | ビルド結果をローカルで確認する |

初回は `setup.bat` → `dev.bat` の順にダブルクリックしてください。Node.js 20 以上が必要です。

### コマンドで実行する場合

```bash
npm install        # package-lock.json が生成されます（コミットしてください）
cp .env.example .env
npm run dev
```

## 3. Google フォームの設定（2フォーム）

| フォーム | 場所 | 環境変数 |
| --- | --- | --- |
| お問い合わせ（お名前 / メールアドレス / お問い合わせ種別 / メッセージ内容） | Contact | `PUBLIC_GFORM_ACTION`、`PUBLIC_GFORM_ENTRY_NAME` `_EMAIL` `_TYPE` `_MESSAGE` |
| 更新情報・テストプレイ登録（メールアドレス / ご希望の内容） | Updates | `PUBLIC_GFORM_NOTIFY_ACTION`、`PUBLIC_GFORM_NOTIFY_ENTRY_EMAIL` `_KIND` |

1. Google フォームを作成し、上の質問を追加します。選択肢は `src/config/form.ts` の `inquiryTypes` / `notifyKinds` と**文字列を完全一致**させてください。
2. フォームの URL 末尾 `/viewform` を `/formResponse` に変えたものを `*_ACTION` に設定します。
3. 各質問の entry ID は、フォームの「⋮」→「事前入力したURLを取得」で全項目に仮の回答を入れて生成した URL の `entry.xxxxxxxxxx=` から確認できます。
4. 値を `.env`（ローカル）と、GitHub のリポジトリ Settings → Secrets and variables → Actions → **Variables**（本番）に登録します。

`PUBLIC_` 付きの値はブラウザに公開されます（Google フォームの送信先はもともと公開情報です）。

## 4. GitHub Pages へのデプロイ

1. リポジトリの Settings → Pages → Source を **GitHub Actions** にします。
2. `main` ブランチへ push すると `.github/workflows/deploy.yml` が実行されます。
3. `<user>.github.io` というリポジトリ名で公開する場合は、workflow の `BASE_PATH` を `/` に変更してください。

## 5. 内容を編集する場所

| 内容 | ファイル |
| --- | --- |
| タイトル一覧・詳細ページ（開発の段階は `stage`） | `src/data/games.ts` |
| 開発ログ（`.md` を1つ足すと記事が増える） | `src/content/log/` |
| SNS などのリンク（URL を入れたものだけ表示） | `src/data/links.ts` |
| メンバー紹介（1人以上で Members セクションが表示） | `src/data/members.ts` |
| F・U・R・E・Q の開発哲学 | `src/data/values.ts` |
| ブランド素材ページ（`/brand/`） | `src/pages/brand.astro` |

開発ログの書式:

```md
---
title: 記事のタイトル
date: "2026-12-01"
summary: 一覧に出る1行の説明
---

本文
```

カバー画像ができたら、`src/components/GameCover.tsx` を `<img>` に置き換えてください。

## デザイン上の約束

- 青（`#1D8FE1`）は「コンパスの針」と「インデックスの選択マーク」、および完了ステータスの点にだけ使います。
- 余白はすべて 4px グリッド。ウェイトは 400 / 500 のみ。
- 発光・グラデーション・絵文字・ループするアニメーションは使いません。
