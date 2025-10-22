import { useState } from "react";
import { Button } from "@/components/ui/button";

const SimpleIndex = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          みらいまる見え家計簿
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          家計の透明性を実現するPWA対応の家計簿アプリケーション
        </p>
        
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setCount(count + 1)}
          >
            テストボタン (クリック数: {count})
          </Button>
          
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold mb-2">環境変数チェック</h3>
            <p className="text-sm text-gray-600">
              Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}
            </p>
            <p className="text-sm text-gray-600">
              Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleIndex;
