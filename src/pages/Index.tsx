import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, Users, Smartphone, Code, Database, Palette } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      // ログイン済みの場合はダッシュボードに遷移
      navigate("/dashboard");
    } else {
      // 未ログインの場合は認証モーダルを表示
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    toast.success("認証成功！ダッシュボードに遷移します。");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            みらいまる見え家計簿
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            家計の透明性を実現するPWA対応の家計簿アプリケーション
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={handleGetStarted}>
              <PlusCircle className="mr-2 h-5 w-5" />
              {user ? "ダッシュボードへ" : "今すぐ始める"}
            </Button>
            <Button variant="outline" size="lg">
              <Smartphone className="mr-2 h-5 w-5" />
              アプリをインストール
            </Button>
          </div>
        </header>

        {/* 特徴セクション */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="mr-2 h-6 w-6 text-green-600" />
                収支管理
              </CardTitle>
              <CardDescription>
                収入・支出の記録とカテゴリ別分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                簡単な操作で日々の収支を記録し、カテゴリ別に分析できます。
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6 text-blue-600" />
                共有機能
              </CardTitle>
              <CardDescription>
                友達や家族とグループで家計簿を共有
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                グループを作成して、家族や友達と家計簿を共有できます。
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-purple-600" />
                データ分析
              </CardTitle>
              <CardDescription>
                グラフによる支出の可視化と月別推移
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                美しいグラフで支出パターンを可視化し、家計を改善できます。
              </p>
            </CardContent>
          </Card>
        </section>

        {/* デモセクション */}
        <section className="text-center mb-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">🚀 ライブデモ</CardTitle>
              <CardDescription>
                実際のアプリケーションを体験してみてください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg font-semibold text-blue-600">
                  https://3f27rvxkzb.skywork.website
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">📱 iPhone/iPad (Safari)</h4>
                    <ol className="text-left space-y-1">
                      <li>1. 上記URLをSafariで開く</li>
                      <li>2. 「共有」→「ホーム画面に追加」</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">🤖 Android (Chrome)</h4>
                    <ol className="text-left space-y-1">
                      <li>1. 上記URLをChromeで開く</li>
                      <li>2. 「アプリをインストール」をタップ</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 技術スタック */}
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-6">🛠️ 技術スタック</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
              <Code className="mr-2 h-5 w-5 text-blue-600" />
              <span className="font-medium">React 18</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
              <Code className="mr-2 h-5 w-5 text-blue-600" />
              <span className="font-medium">TypeScript</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
              <Palette className="mr-2 h-5 w-5 text-cyan-600" />
              <span className="font-medium">Tailwind CSS</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
              <Database className="mr-2 h-5 w-5 text-green-600" />
              <span className="font-medium">Supabase</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
              <span className="font-medium">Recharts</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
              <Smartphone className="mr-2 h-5 w-5 text-orange-600" />
              <span className="font-medium">PWA</span>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="text-center text-gray-600">
          <p className="mb-2">
            開発者: <span className="font-semibold">masahiro-nagai</span>
          </p>
          <p className="text-sm">
            バージョン 1.0.0 | MIT License
          </p>
        </footer>
      </div>

      {/* 認証モーダル */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;