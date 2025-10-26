import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Check } from 'lucide-react';

interface DefaultCategoriesSetupProps {
  onSuccess: () => void;
}

const defaultCategories = {
  expense: [
    { name: '食費', color: '#EF4444' },
    { name: '交通費', color: '#3B82F6' },
    { name: '娯楽費', color: '#8B5CF6' },
    { name: '光熱費', color: '#F59E0B' },
    { name: '通信費', color: '#10B981' },
    { name: '医療費', color: '#EC4899' },
    { name: '教育費', color: '#06B6D4' },
    { name: 'その他', color: '#6B7280' }
  ],
  income: [
    { name: '給与', color: '#10B981' },
    { name: 'ボーナス', color: '#8B5CF6' },
    { name: '副業', color: '#F59E0B' },
    { name: '投資', color: '#3B82F6' },
    { name: 'その他収入', color: '#6B7280' }
  ]
};

export function DefaultCategoriesSetup({ onSuccess }: DefaultCategoriesSetupProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [createdCategories, setCreatedCategories] = useState<string[]>([]);

  const createDefaultCategories = async () => {
    if (!user) return;

    setLoading(true);
    const newCategories: string[] = [];

    try {
      // 支出カテゴリを作成
      for (const category of defaultCategories.expense) {
        const { error } = await supabase
          .from('categories')
          .insert({
            user_id: user.id,
            name: category.name,
            color: category.color,
            type: 'expense'
          });

        if (!error) {
          newCategories.push(category.name);
        }
      }

      // 収入カテゴリを作成
      for (const category of defaultCategories.income) {
        const { error } = await supabase
          .from('categories')
          .insert({
            user_id: user.id,
            name: category.name,
            color: category.color,
            type: 'income'
          });

        if (!error) {
          newCategories.push(category.name);
        }
      }

      setCreatedCategories(newCategories);
      toast.success('デフォルトカテゴリを作成しました！');
      onSuccess();
    } catch (error: any) {
      console.error('カテゴリの作成に失敗しました:', error);
      toast.error('カテゴリの作成に失敗しました: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          デフォルトカテゴリの設定
        </CardTitle>
        <CardDescription>
          支出用と収入用のデフォルトカテゴリを作成します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 支出カテゴリ */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-600">支出カテゴリ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {defaultCategories.expense.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded-lg"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm">{category.name}</span>
                {createdCategories.includes(category.name) && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 収入カテゴリ */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-600">収入カテゴリ</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {defaultCategories.income.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded-lg"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm">{category.name}</span>
                {createdCategories.includes(category.name) && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 作成ボタン */}
        <Button 
          onClick={createDefaultCategories} 
          disabled={loading}
          className="w-full"
        >
          {loading ? '作成中...' : 'デフォルトカテゴリを作成'}
        </Button>
      </CardContent>
    </Card>
  );
}
