#!/bin/bash

echo "🚀 みらいまる見え家計簿 - GitHubアップロード開始"
echo "================================================"

# 現在のディレクトリを確認
if [ ! -f "package.json" ]; then
    echo "❌ エラー: package.jsonが見つかりません"
    echo "   marumie-kakeiboディレクトリで実行してください"
    exit 1
fi

echo "📁 現在のディレクトリ: $(pwd)"
echo ""

# Git設定確認
echo "🔧 Git設定を確認中..."
git_name=$(git config --global user.name 2>/dev/null)
git_email=$(git config --global user.email 2>/dev/null)

if [ -z "$git_name" ] || [ -z "$git_email" ]; then
    echo "⚠️  Git設定が不完全です。以下を実行してください:"
    echo "   git config --global user.name \"Your Name\""
    echo "   git config --global user.email \"your.email@example.com\""
    echo ""
    read -p "設定を続行しますか？ (y/N): " continue_setup
    if [[ ! $continue_setup =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Git設定OK: $git_name <$git_email>"
fi

echo ""

# リポジトリURLの確認
REPO_URL="https://github.com/masahiro-nagai/marumie-kakeibo.git"
echo "📡 アップロード先: $REPO_URL"
echo ""

# GitHubでリポジトリを作成したか確認
echo "❓ GitHubでリポジトリを作成しましたか？"
echo "   1. https://github.com/masahiro-nagai にアクセス"
echo "   2. 'New repository' をクリック"
echo "   3. リポジトリ名: marumie-kakeibo"
echo "   4. 説明: 家計の透明性を実現するPWA対応の家計簿アプリケーション"
echo "   5. 'Create repository' をクリック"
echo ""

read -p "GitHubでリポジトリを作成しましたか？ (y/N): " repo_created
if [[ ! $repo_created =~ ^[Yy]$ ]]; then
    echo "❌ 先にGitHubでリポジトリを作成してください"
    echo "   https://github.com/new"
    exit 1
fi

echo ""
echo "🔄 Gitリポジトリを初期化中..."

# 既存の.gitディレクトリがあれば削除
if [ -d ".git" ]; then
    echo "🗑️  既存の.gitディレクトリを削除中..."
    rm -rf .git
fi

# Gitを初期化
git init
echo "✅ Git初期化完了"

# ファイルをステージング
echo "📦 ファイルをステージング中..."
git add .
echo "✅ ステージング完了"

# コミット
echo "💾 初回コミット中..."
git commit -m "Initial commit: PWA対応家計簿アプリ

✨ 主な機能:
- React + TypeScript + Vite
- Supabase認証・データベース
- 友達との共有機能
- PWA対応（iOS/Android）
- レスポンシブデザイン
- カテゴリ別支出分析
- グラフによる可視化

🚀 デプロイ:
- ライブデモ: https://3f27rvxkzb.skywork.website
- Vercel/Netlify対応

📱 PWA機能:
- オフライン対応
- ホーム画面追加
- アプリライク体験"

if [ $? -eq 0 ]; then
    echo "✅ コミット完了"
else
    echo "❌ コミットに失敗しました"
    exit 1
fi

# メインブランチに変更
git branch -M main
echo "✅ メインブランチ設定完了"

# リモートリポジトリを追加
echo "🔗 リモートリポジトリを追加中..."
git remote add origin $REPO_URL
echo "✅ リモートリポジトリ追加完了"

# GitHubにプッシュ
echo ""
echo "🚀 GitHubにプッシュ中..."
echo "   認証が必要な場合は、GitHubの認証情報を入力してください"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 GitHubアップロード完了！"
    echo "================================================"
    echo "📡 リポジトリURL: https://github.com/masahiro-nagai/marumie-kakeibo"
    echo "🌐 ライブデモ: https://3f27rvxkzb.skywork.website"
    echo ""
    echo "📋 次のステップ:"
    echo "   1. GitHubでリポジトリを確認"
    echo "   2. README.mdを確認"
    echo "   3. Vercel/Netlifyでデプロイ設定"
    echo ""
else
    echo ""
    echo "❌ プッシュに失敗しました"
    echo "   以下を確認してください:"
    echo "   1. GitHubでリポジトリが作成されているか"
    echo "   2. GitHubの認証情報が正しいか"
    echo "   3. インターネット接続が正常か"
    echo ""
    echo "🔄 手動でプッシュする場合:"
    echo "   git push -u origin main"
    exit 1
fi