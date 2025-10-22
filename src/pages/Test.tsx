const Test = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          テストページ
        </h1>
        <p className="text-xl text-gray-600">
          このページが表示されれば、基本的なレンダリングは動作しています。
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">
            環境変数URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ 設定済み' : '❌ 未設定'}
          </p>
          <p className="text-sm text-gray-500">
            環境変数KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 設定済み' : '❌ 未設定'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Test;
