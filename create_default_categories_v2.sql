-- ========================================
-- デフォルトカテゴリの作成（支出用・収入用分離版）
-- ========================================

-- 支出カテゴリ
INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '食費',
  '#EF4444',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '食費' AND user_id = auth.uid() AND type = 'expense');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '交通費',
  '#3B82F6',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '交通費' AND user_id = auth.uid() AND type = 'expense');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '娯楽費',
  '#8B5CF6',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '娯楽費' AND user_id = auth.uid() AND type = 'expense');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '光熱費',
  '#F59E0B',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '光熱費' AND user_id = auth.uid() AND type = 'expense');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '通信費',
  '#10B981',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '通信費' AND user_id = auth.uid() AND type = 'expense');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '医療費',
  '#EC4899',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '医療費' AND user_id = auth.uid() AND type = 'expense');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '教育費',
  '#06B6D4',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '教育費' AND user_id = auth.uid() AND type = 'expense');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  'その他',
  '#6B7280',
  'expense'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'その他' AND user_id = auth.uid() AND type = 'expense');

-- 収入カテゴリ
INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '給与',
  '#10B981',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '給与' AND user_id = auth.uid() AND type = 'income');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  'ボーナス',
  '#8B5CF6',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'ボーナス' AND user_id = auth.uid() AND type = 'income');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '副業',
  '#F59E0B',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '副業' AND user_id = auth.uid() AND type = 'income');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  '投資',
  '#3B82F6',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = '投資' AND user_id = auth.uid() AND type = 'income');

INSERT INTO public.categories (user_id, name, color, type) 
SELECT 
  auth.uid(),
  'その他収入',
  '#6B7280',
  'income'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'その他収入' AND user_id = auth.uid() AND type = 'income');

-- 完了メッセージ
SELECT 
  'デフォルトカテゴリ作成完了' as status,
  '支出用と収入用のカテゴリが作成されました' as message,
  NOW() as timestamp;
