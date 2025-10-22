import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import SimpleIndex from "./pages/SimpleIndex";
import AuthTest from "./pages/AuthTest";
import { ErrorBoundary } from "./components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleIndex />} />
        <Route path="/test" element={<Test />} />
        <Route path="/auth-test" element={<AuthTest />} />
        <Route path="/index" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;