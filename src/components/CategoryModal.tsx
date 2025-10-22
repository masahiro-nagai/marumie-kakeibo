import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Tag, Palette } from "lucide-react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultColors = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
];

export function CategoryModal({ isOpen, onClose, onSuccess }: CategoryModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: defaultColors[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name: formData.name,
          color: formData.color,
        });

      if (error) throw error;

      toast.success('カテゴリを作成しました！');
      onSuccess();
      onClose();
      
      // フォームをリセット
      setFormData({
        name: "",
        color: defaultColors[0],
      });
    } catch (error: any) {
      console.error('カテゴリの作成に失敗しました:', error);
      toast.error('カテゴリの作成に失敗しました: ' + error.message);
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
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl text-center">カテゴリを作成</CardTitle>
          <CardDescription className="text-center">
            新しいカテゴリを追加してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* カテゴリ名 */}
            <div className="space-y-2">
              <Label htmlFor="name">カテゴリ名</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="例: 食費、交通費、娯楽費"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* 色選択 */}
            <div className="space-y-2">
              <Label>色</Label>
              <div className="grid grid-cols-5 gap-2">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-10 h-10 rounded-full border-2 ${
                      formData.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleInputChange("color", color)}
                  />
                ))}
              </div>
            </div>

            {/* プレビュー */}
            <div className="space-y-2">
              <Label>プレビュー</Label>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: formData.color }}
                />
                <span className="font-medium">
                  {formData.name || "カテゴリ名"}
                </span>
              </div>
            </div>

            {/* 送信ボタン */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "作成中..." : "カテゴリを作成"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
