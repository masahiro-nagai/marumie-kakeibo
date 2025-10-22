import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Plus, Minus, Calendar, Tag, FileText } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export function TransactionModal({ isOpen, onClose, onSuccess }: TransactionModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: "expense" as "income" | "expense",
    category_id: "",
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  });

  // カテゴリを取得
  useEffect(() => {
    if (isOpen && user) {
      fetchCategories();
    }
  }, [isOpen, user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('カテゴリの取得に失敗しました:', error);
      toast.error('カテゴリの取得に失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: parseFloat(formData.amount),
          description: formData.description || null,
          type: formData.type,
          category_id: formData.category_id || null,
          date: formData.date,
        });

      if (error) throw error;

      toast.success('取引を記録しました！');
      onSuccess();
      onClose();
      
      // フォームをリセット
      setFormData({
        amount: "",
        description: "",
        type: "expense",
        category_id: "",
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error: any) {
      console.error('取引の記録に失敗しました:', error);
      toast.error('取引の記録に失敗しました: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl text-center">取引を記録</CardTitle>
          <CardDescription className="text-center">
            収入または支出を記録してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 取引タイプ */}
            <div className="space-y-2">
              <Label>取引タイプ</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.type === "expense" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleInputChange("type", "expense")}
                >
                  <Minus className="mr-2 h-4 w-4" />
                  支出
                </Button>
                <Button
                  type="button"
                  variant={formData.type === "income" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleInputChange("type", "income")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  収入
                </Button>
              </div>
            </div>

            {/* 金額 */}
            <div className="space-y-2">
              <Label htmlFor="amount">金額</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">¥</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="pl-8"
                  required
                  min="0"
                  step="1"
                />
              </div>
            </div>

            {/* カテゴリ */}
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ</Label>
              <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {categories.length === 0 && (
                    <SelectItem value="" disabled>
                      カテゴリがありません
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 日付 */}
            <div className="space-y-2">
              <Label htmlFor="date">日付</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* 説明 */}
            <div className="space-y-2">
              <Label htmlFor="description">説明（任意）</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="description"
                  placeholder="取引の詳細を入力..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="pl-10 min-h-[80px]"
                  rows={3}
                />
              </div>
            </div>

            {/* 送信ボタン */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "記録中..." : "取引を記録"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
