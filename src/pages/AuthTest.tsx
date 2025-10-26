import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AuthTest = () => {
  const { user, signIn, signUp, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");

  // ログイン済みの場合はダッシュボードに自動遷移
  useEffect(() => {
    if (user && !loading) {
      console.log("ユーザーがログイン済みです。ダッシュボードに遷移します。");
      toast.success("ログイン済みです。ダッシュボードに遷移します。");
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('count')
        .limit(1);
      
      if (error) {
        toast.error(`Supabase接続エラー: ${error.message}`);
      } else {
        toast.success("Supabase接続成功！");
      }
    } catch (err) {
      toast.error(`接続エラー: ${err}`);
    }
  };

  const handleSignIn = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(`ログインエラー: ${error.message}`);
    } else {
      toast.success("ログイン成功！ダッシュボードに遷移します。");
      navigate("/dashboard");
    }
  };

  const handleSignUp = async () => {
    console.log("新規登録を試行中...", { email, password });
    const { data, error } = await signUp(email, password);
    console.log("新規登録結果:", { data, error });
    
    if (error) {
      toast.error(`登録エラー: ${error.message}`);
      console.error("登録エラーの詳細:", error);
    } else {
      if (data.user && !data.user.email_confirmed_at) {
        toast.success("登録成功！確認メールをチェックしてください。");
      } else {
        toast.success("登録成功！ダッシュボードに遷移します。");
        navigate("/dashboard");
      }
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(`ログアウトエラー: ${error.message}`);
    } else {
      toast.success("ログアウト成功！");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">認証テスト</h1>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Button onClick={testSupabaseConnection} className="w-full">
              Supabase接続テスト
            </Button>
            
            <Button onClick={handleSignUp} className="w-full">
              新規登録
            </Button>
            
            <Button onClick={handleSignIn} className="w-full">
              ログイン
            </Button>
            
            {user && (
              <Button onClick={handleSignOut} variant="outline" className="w-full">
                ログアウト
              </Button>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-bold mb-2">状態</h3>
            <p className="text-sm">ローディング: {loading ? "⏳" : "✅"}</p>
            <p className="text-sm">ユーザー: {user ? `✅ ${user.email}` : "❌"}</p>
            <p className="text-sm">環境変数: {import.meta.env.VITE_SUPABASE_URL ? "✅" : "❌"}</p>
            <p className="text-sm">Supabase URL: {import.meta.env.VITE_SUPABASE_URL}</p>
            <p className="text-sm">現在のURL: {window.location.href}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
