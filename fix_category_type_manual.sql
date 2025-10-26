-- ========================================
-- カテゴリテーブルにtypeカラムを追加（手動版）
-- ========================================

-- Step 1: カテゴリテーブルにtypeカラムを追加
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS type VARCHAR(10) DEFAULT 'expense' CHECK (type IN ('expense', 'income'));

-- Step 2: 既存のカテゴリを適切なタイプに分類
-- 支出カテゴリ
UPDATE public.categories 
SET type = 'expense' 
WHERE name IN ('食費', '交通費', '娯楽費', '光熱費', '通信費', '医療費', '教育費', 'その他');

-- 収入カテゴリ
UPDATE public.categories 
SET type = 'income' 
WHERE name IN ('給与', 'ボーナス', '副業', '投資', 'その他収入');

-- Step 3: 現在のユーザーIDを確認
SELECT 
  '現在のユーザーID' as info,
  auth.uid() as user_id,
  'このIDを使ってカテゴリを作成してください' as message;
