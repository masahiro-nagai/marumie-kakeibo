import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { PlusCircle, TrendingUp, Users, LogOut, User, Settings } from "lucide-react";
import { toast } from "sonner";
import { TransactionModal } from "@/components/TransactionModal";
import { CategoryModal } from "@/components/CategoryModal";
import { DebugInfo } from "@/components/DebugInfo";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("ログアウトに失敗しました");
    } else {
      toast.success("ログアウトしました");
    }
  };

  const handleTransactionSuccess = () => {
    // 取引記録成功時の処理（必要に応じてデータを再取得）
    toast.success("取引を記録しました！");
  };

  const handleCategorySuccess = () => {
    // カテゴリ作成成功時の処理
    toast.success("カテゴリを作成しました！");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                みらいまる見え家計簿
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {user?.email}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("overview")}
            >
              概要
            </Button>
            <Button
              variant={activeTab === "transactions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("transactions")}
            >
              取引
            </Button>
            <Button
              variant={activeTab === "groups" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("groups")}
            >
              グループ
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("analytics")}
            >
              分析
            </Button>
          </div>
        </div>

        {/* コンテンツエリア */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今月の支出</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥0</div>
                  <p className="text-xs text-muted-foreground">
                    前月比 +0%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今月の収入</CardTitle>
                  <PlusCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥0</div>
                  <p className="text-xs text-muted-foreground">
                    前月比 +0%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">参加グループ</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    グループ数
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ようこそ！</CardTitle>
                <CardDescription>
                  みらいまる見え家計簿へようこそ。まずは取引を記録してみましょう。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={() => setIsTransactionModalOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    最初の取引を記録
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsCategoryModalOpen(true)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    カテゴリを作成
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "transactions" && (
          <Card>
            <CardHeader>
              <CardTitle>取引履歴</CardTitle>
              <CardDescription>
                収入と支出の記録を管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                まだ取引がありません。最初の取引を記録してみましょう。
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "groups" && (
          <Card>
            <CardHeader>
              <CardTitle>グループ管理</CardTitle>
              <CardDescription>
                家族や友達と家計簿を共有します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                まだグループがありません。新しいグループを作成してみましょう。
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "analytics" && (
          <Card>
            <CardHeader>
              <CardTitle>データ分析</CardTitle>
              <CardDescription>
                支出パターンと家計の傾向を分析します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                分析データがありません。取引を記録して分析を開始しましょう。
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* モーダル */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleCategorySuccess}
      />

      {/* デバッグ情報 */}
      <DebugInfo />
    </div>
  );
};

export default Dashboard;
