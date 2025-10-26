import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { PlusCircle, TrendingUp, Users, LogOut, User, Settings } from "lucide-react";
import { toast } from "sonner";
import { TransactionModal } from "@/components/TransactionModal";
import { CategoryModal } from "@/components/CategoryModal";
import { DebugInfo } from "@/components/DebugInfo";
import ExpenseAnalysis from "@/components/ExpenseAnalysis";
import IncomeAnalysis from "@/components/IncomeAnalysis";
import OverallAnalysis from "@/components/OverallAnalysis";
import { DefaultCategoriesSetup } from "@/components/DefaultCategoriesSetup";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [showDefaultCategoriesSetup, setShowDefaultCategoriesSetup] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    monthlyExpense: 0,
    monthlyIncome: 0,
    groupCount: 0
  });

  // 認証チェック：未ログインの場合は認証ページにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      console.log("ユーザーがログインしていません。認証ページにリダイレクトします。");
      toast.error("ログインが必要です。");
      navigate("/auth-test");
    }
  }, [user, loading, navigate]);

  // データ取得
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      console.log('データ取得を開始します...', { userId: user.id });
      
      // 取引データを取得（RLSエラーを回避するため、より安全なクエリ）
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(100); // 制限を追加してパフォーマンスを向上

      console.log('取引データ取得結果:', { transactionsData, transactionsError });

      if (transactionsError) {
        console.error('取引データ取得エラー:', transactionsError);
        throw transactionsError;
      }

      // カテゴリデータを取得（RLSエラーを回避するため、より安全なクエリ）
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')
        .limit(50); // 制限を追加してパフォーマンスを向上

      console.log('カテゴリデータ取得結果:', { categoriesData, categoriesError });

      if (categoriesError) {
        console.error('カテゴリデータ取得エラー:', categoriesError);
        throw categoriesError;
      }

      // 統計データを計算
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyTransactions = transactionsData?.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      }) || [];

      const monthlyExpense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setTransactions(transactionsData || []);
      setCategories(categoriesData || []);
      setStats({
        monthlyExpense,
        monthlyIncome,
        groupCount: 0 // グループ機能は未実装
      });

    } catch (error) {
      console.error('データ取得エラー:', error);
      toast.error(`データの取得に失敗しました: ${error.message || error}`);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("ログアウトに失敗しました");
    } else {
      toast.success("ログアウトしました");
      navigate("/auth-test");
    }
  };

  const handleTransactionSuccess = () => {
    // 取引記録成功時の処理（データを再取得）
    toast.success("取引を記録しました！");
    fetchData(); // データを再取得
  };

  const handleCategorySuccess = () => {
    // カテゴリ作成成功時の処理
    toast.success("カテゴリを作成しました！");
    fetchData(); // データを再取得
  };

  const handleDefaultCategoriesSuccess = () => {
    toast.success("デフォルトカテゴリを作成しました！");
    setShowDefaultCategoriesSetup(false);
    fetchData(); // Re-fetch data after category creation
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!user) {
    return null;
  }

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
                <div className="text-2xl font-bold">¥{stats.monthlyExpense.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  今月の支出
                </p>
              </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今月の収入</CardTitle>
                  <PlusCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥{stats.monthlyIncome.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    今月の収入
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">参加グループ</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.groupCount}</div>
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
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowDefaultCategoriesSetup(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    デフォルトカテゴリを設定
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
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  まだ取引がありません。最初の取引を記録してみましょう。
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => {
                    // カテゴリ情報を取得
                    const category = categories.find(cat => cat.id === transaction.category_id);
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category?.color || '#6B7280' }}
                          />
                          <div>
                            <p className="font-medium">{transaction.description || '取引'}</p>
                            <p className="text-sm text-gray-500">
                              {category?.name || 'カテゴリなし'} • {new Date(transaction.date).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
          <div className="space-y-6">
            <Tabs defaultValue="overall" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overall">総合分析</TabsTrigger>
                <TabsTrigger value="expense">支出分析</TabsTrigger>
                <TabsTrigger value="income">収入分析</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overall">
                <OverallAnalysis 
                  transactions={transactions} 
                  categories={categories} 
                />
              </TabsContent>
              
              <TabsContent value="expense">
                <ExpenseAnalysis 
                  transactions={transactions} 
                  categories={categories} 
                />
              </TabsContent>
              
              <TabsContent value="income">
                <IncomeAnalysis 
                  transactions={transactions} 
                  categories={categories} 
                />
              </TabsContent>
            </Tabs>
          </div>
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

      {/* デフォルトカテゴリ設定 */}
      {showDefaultCategoriesSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <DefaultCategoriesSetup
            onSuccess={handleDefaultCategoriesSuccess}
          />
        </div>
      )}

      {/* デバッグ情報 */}
      <DebugInfo />
    </div>
  );
};

export default Dashboard;
