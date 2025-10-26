-- ========================================
-- カテゴリテーブルにtypeカラムを追加
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

-- Step 3: デフォルトカテゴリを作成（既存のカテゴリがない場合）
INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '食費',
  '#EF4444',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '食費' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '交通費',
  '#3B82F6',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '交通費' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '娯楽費',
  '#8B5CF6',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '娯楽費' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '光熱費',
  '#F59E0B',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '光熱費' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '通信費',
  '#10B981',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '通信費' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '医療費',
  '#EC4899',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '医療費' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '教育費',
  '#06B6D4',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '教育費' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  'その他',
  '#6B7280',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'その他' AND user_id = auth.uid());

-- 収入カテゴリ
INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '給与',
  '#10B981',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '給与' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  'ボーナス',
  '#8B5CF6',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'ボーナス' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '副業',
  '#F59E0B',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '副業' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '投資',
  '#3B82F6',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '投資' AND user_id = auth.uid());

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  'その他収入',
  '#6B7280',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'その他収入' AND user_id = auth.uid());

-- Step 4: 完了メッセージ
SELECT 
  'カテゴリタイプ追加完了' as status,
  '支出用と収入用のカテゴリが分離されました' as message,
  NOW() as timestamp;
