import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function DebugInfo() {
  const { user, session, loading } = useAuth();

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('count')
        .limit(1);
      
      console.log('Supabase接続テスト:', { data, error });
      return { success: !error, error };
    } catch (err) {
      console.error('Supabase接続エラー:', err);
      return { success: false, error: err };
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">デバッグ情報</h3>
      <div className="space-y-1">
        <div>環境変数URL: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}</div>
        <div>環境変数KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}</div>
        <div>認証ローディング: {loading ? '⏳' : '✅'}</div>
        <div>ユーザー: {user ? `✅ ${user.email}` : '❌'}</div>
        <div>セッション: {session ? '✅' : '❌'}</div>
        <button 
          onClick={testSupabaseConnection}
          className="mt-2 px-2 py-1 bg-blue-600 rounded text-xs"
        >
          Supabase接続テスト
        </button>
      </div>
    </div>
  );
}
