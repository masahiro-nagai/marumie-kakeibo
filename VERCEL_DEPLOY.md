# Vercelへのデプロイ手順

## 📋 事前準備

### 1. GitHubリポジトリの確認
- リポジトリ: `masahiro-nagai/marumie-kakeibo`
- 最新のコードがプッシュされていることを確認

### 2. Vercelアカウントの準備
- [Vercel](https://vercel.com)にアクセス
- GitHubアカウントでログイン

## 🚀 デプロイ手順

### Step 1: プロジェクトのインポート

1. Vercelダッシュボードにアクセス
2. **"Add New..."** → **"Project"** をクリック
3. **GitHub** を選択して認証
4. リポジトリ一覧から **`marumie-kakeibo`** を選択
5. **"Import"** をクリック

### Step 2: ビルド設定

Vercelは自動的にViteプロジェクトを検出しますが、念のため確認：

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: 環境変数の設定

**Settings** → **Environment Variables** に以下を追加：

#### 必須環境変数

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | SupabaseプロジェクトのURL |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` | Supabaseの公開匿名キー |

#### 環境変数の設定場所

各環境変数を以下の**3つの環境**すべてに追加：
- ✅ **Production** (本番環境)
- ✅ **Preview** (プレビュー環境)
- ✅ **Development** (開発環境)

### Step 4: Supabaseの認証設定を更新

1. **Supabaseダッシュボード**にアクセス
2. **Authentication** → **URL Configuration** を開く
3. 以下のURLを設定：

#### Site URL
```
https://your-project.vercel.app
```

#### Redirect URLs
以下を追加：
```
https://your-project.vercel.app/*
https://your-project.vercel.app/dashboard
https://your-project.vercel.app/auth-test
```

**プレビュー環境用**（任意ですが推奨）：
```
https://*-your-team.vercel.app/*
```

### Step 5: メール確認設定（開発環境向け）

開発中にメール確認をスキップしたい場合：

1. Supabaseダッシュボード → **Authentication** → **Providers**
2. **Email** を選択
3. **"Confirm email"** のチェックを**外す**（開発環境のみ）
4. **Save** をクリック

⚠️ **注意**: 本番環境では必ずメール確認を有効にしてください。

### Step 6: デプロイの実行

1. Vercelの設定画面で **"Deploy"** をクリック
2. ビルドが完了するまで待機（通常1-2分）
3. デプロイ完了後、**Visit** をクリックして動作確認

## 🔍 デプロイ後の確認

### チェックリスト

- [ ] トップページが表示される
- [ ] 「今すぐ始める」ボタンが機能する
- [ ] ログイン/新規登録ができる
- [ ] ダッシュボードに遷移できる
- [ ] 取引の記録ができる
- [ ] カテゴリの作成ができる
- [ ] 分析画面が表示される

### よくある問題

#### 1. 環境変数が反映されない
- **解決策**: Vercelの環境変数を再設定し、再デプロイ

#### 2. 認証エラーが発生する
- **解決策**: SupabaseのRedirect URLsにVercelのURLを追加

#### 3. ビルドエラーが発生する
- **解決策**: ローカルで `npm run build` を実行してエラーを確認

## 📝 継続的なデプロイ

VercelはGitHubへのプッシュを自動的に検知してデプロイします：

- **mainブランチ**: 本番環境に自動デプロイ
- **その他のブランチ**: プレビュー環境に自動デプロイ

## 🔗 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)

