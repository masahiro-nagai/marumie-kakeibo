import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("🚀 アプリケーションを開始します...");
console.log("環境変数URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("環境変数KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "設定済み" : "未設定");

const rootElement = document.getElementById("root");
console.log("ルート要素:", rootElement);

if (!rootElement) {
  console.error("❌ ルート要素が見つかりません");
} else {
  console.log("✅ ルート要素が見つかりました");
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}