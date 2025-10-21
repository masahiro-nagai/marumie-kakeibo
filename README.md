# みらいまる見え家計簿

家計の透明性を実現するPWA対応の家計簿アプリケーション。友達や家族と家計簿を共有して、お金の流れを見える化できます。

## 🌟 特徴

- **💰 収支管理**: 収入・支出の記録とカテゴリ別分析
- **👥 共有機能**: 友達や家族とグループで家計簿を共有
- **📊 データ分析**: グラフによる支出の可視化と月別推移
- **📱 PWA対応**: スマホアプリのような体験（iOS/Android対応）
- **🔒 セキュア**: Supabaseによる安全なユーザー認証とデータ管理

## 🚀 デモ

**ライブデモ**: https://3f27rvxkzb.skywork.website

### スマホアプリとしてインストール

**iPhone/iPad (Safari):**
1. 上記URLをSafariで開く
2. 「共有」→「ホーム画面に追加」

**Android (Chrome):**
1. 上記URLをChromeで開く
2. 「アプリをインストール」をタップ

## 🛠️ 技術スタック

- **フロントエンド**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui
- **バックエンド**: Supabase (PostgreSQL, Authentication, RLS)
- **グラフ**: Recharts
- **PWA**: Service Worker, Web App Manifest

## 📦 インストール

### 前提条件

- Node.js 18以上
- npm または pnpm

### セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/masahiro-nagai/marumie-kakeibo.git
cd marumie-kakeibo