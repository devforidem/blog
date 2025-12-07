# 技術ブログ

Hugo + PaperMod テーマ + Cloudflare Pages で構築した技術ブログです。

## 技術スタック

- **Static Site Generator**: Hugo (v0.152+)
- **テーマ**: PaperMod
- **CI/CD**: GitHub Actions
- **ホスティング**: Cloudflare Pages（無料）
- **独自ドメイン**: Xserver DNS

## ディレクトリ構成

```
my-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions（Hugo build + Cloudflare Pages deploy）
├── content/
│   ├── posts/                  # 記事ディレクトリ
│   │   └── *.md               # Markdown 記事ファイル
│   ├── search.md              # 検索ページ
│   └── archives.md            # アーカイブページ
├── static/
│   └── images/                # 画像ファイル
├── themes/
│   └── PaperMod/              # Hugo テーマ（Git submodule）
├── hugo.toml                  # Hugo 設定ファイル
├── .gitignore                 # Git 除外設定
├── CLAUDE.md                  # プロジェクト指示書
└── README.md                  # このファイル
```

## セットアップ手順

### 1. 前提条件

- Git がインストール済み
- Hugo がインストール済み（`brew install hugo`）
- GitHub アカウント
- Cloudflare アカウント

### 2. ローカルでの動作確認

```bash
# リポジトリをクローン（submodule も取得）
git clone --recurse-submodules <your-repo-url>
cd my-blog

# ローカルサーバー起動（ドラフト記事も表示）
hugo server -D

# ブラウザで http://localhost:1313 を開く
```

### 3. Cloudflare Pages のセットアップ

#### 3-1. Cloudflare Pages プロジェクト作成

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. **Pages** → **Create a project** をクリック
3. **Connect to Git** で GitHub リポジトリを選択
4. ビルド設定:
   - **Framework preset**: Hugo
   - **Build command**: `hugo --minify`
   - **Build output directory**: `public`
   - **Environment variables**:
     - `HUGO_VERSION`: `0.152.2`（または最新版）

5. **Save and Deploy** をクリック

#### 3-2. API トークンの取得

1. Cloudflare Dashboard → **My Profile** → **API Tokens**
2. **Create Token** → **Edit Cloudflare Pages** テンプレートを選択
3. **Account Resources** で自分のアカウントを選択
4. **Continue to summary** → **Create Token**
5. トークンをコピー（⚠️ 一度しか表示されません！）

#### 3-3. GitHub Secrets の設定

**⚠️ 重要**: 機密情報は GitHub Secrets で管理し、絶対にハードコードしない！

1. GitHub リポジトリ → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** で以下を登録:

| Secret 名 | 値 | 取得方法 |
|-----------|---|---------|
| `CLOUDFLARE_API_TOKEN` | `your-api-token` | 上記 3-2 で取得 |
| `CLOUDFLARE_ACCOUNT_ID` | `your-account-id` | Cloudflare Dashboard → **Pages** → プロジェクト → **Settings** → **Account ID** |

3. `.github/workflows/deploy.yml` の `projectName` を実際のプロジェクト名に変更

```yaml
projectName: my-blog  # ← Cloudflare Pages のプロジェクト名に変更
```

### 4. 独自ドメインの設定（オプション）

1. Cloudflare Pages → プロジェクト → **Custom domains**
2. **Set up a custom domain** をクリック
3. ドメインを入力（例: `blog.your-domain.com`）
4. DNS レコードを追加（Cloudflare が自動的に設定）

Xserver で管理している場合:
- Xserver DNS → CNAME レコード追加
- `blog.your-domain.com` → `your-project.pages.dev`

## 記事の執筆フロー

### 1. 新しい記事を作成

```bash
# content/posts/ 配下に記事を作成
hugo new posts/2025-12-07-my-first-post.md
```

### 2. Markdown で記事を執筆

```markdown
---
title: "記事タイトル"
date: 2025-12-07T10:00:00+09:00
draft: false  # true: 下書き、false: 公開
tags: ["DevOps", "Terraform", "Google Cloud"]
categories: ["インフラ"]
---

## はじめに

記事の内容...

## コード例

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
\`\`\`

## 画像の挿入

![スクリーンショット](/images/2025-12-07-screenshot.png)
```

### 3. 画像の配置

```bash
# static/images/ に画像を配置
cp ~/screenshot.png static/images/2025-12-07-screenshot.png
```

### 4. ローカルでプレビュー

```bash
# ドラフト記事も表示
hugo server -D

# http://localhost:1313 で確認
```

### 5. Git で公開

```bash
# 変更をコミット
git add .
git commit -m "Add: 新しい記事タイトル"

# main ブランチにプッシュ
git push origin main

# → GitHub Actions が自動的にビルド & デプロイ
```

## デプロイフロー

```
[ローカル]
  ↓ git push origin main
[GitHub Actions]
  ├─ Hugo Build (hugo --minify)
  └─ Deploy to Cloudflare Pages
       ↓
[Cloudflare Pages]
  ├─ グローバルCDN
  ├─ 自動HTTPS
  └─ 独自ドメイン
```

### PR ベースのワークフロー（推奨）

```bash
# feature ブランチで作業
git checkout -b feature/new-post
# 記事を執筆...
git add .
git commit -m "Add: 新しい記事"
git push origin feature/new-post

# GitHub で PR 作成
# → GitHub Actions がビルドのみ実行（エラーチェック）

# PR マージ後
# → main ブランチに自動デプロイ
```

## セキュリティ

### 絶対に守ること

1. **機密情報は GitHub Secrets で管理**
   - Cloudflare API Token → `CLOUDFLARE_API_TOKEN`
   - 絶対にハードコードしない！

2. **.gitignore に除外設定**
   - `.env`, `*.secret`, `*.key` は Git にコミットしない

3. **最小権限の原則**
   - Cloudflare API Token は Pages デプロイ専用権限のみ

### 推奨すること

- Dependabot を有効化（GitHub Actions の依存関係を自動更新）
- Branch Protection を設定（main への直接 push を禁止）

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
hugo --minify

# エラーが出る場合は hugo.toml を確認
```

### デプロイエラー

```bash
# GitHub Actions のログを確認
# Settings → Secrets → CLOUDFLARE_API_TOKEN が正しいか確認
```

### テーマが反映されない

```bash
# submodule を更新
git submodule update --init --recursive
```

## 参考リンク

- [Hugo 公式ドキュメント](https://gohugo.io/documentation/)
- [PaperMod テーマ](https://github.com/adityatelange/hugo-PaperMod)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

## ライセンス

MIT License
