-- ========================================
-- デフォルトカテゴリの作成
-- ========================================

-- 現在ログインしているユーザーのIDを取得
-- 注意: このSQLは手動でユーザーIDを指定する必要があります

-- 例: ユーザーID 'test2@example.com' のユーザーIDを取得
-- SELECT id FROM auth.users WHERE email = 'test2@example.com';

-- デフォルトカテゴリを作成
-- 以下のSQLを実行する前に、実際のユーザーIDに置き換えてください

INSERT INTO public.categories (name, color, user_id) VALUES
('食費', '#EF4444', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('交通費', '#3B82F6', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('娯楽費', '#8B5CF6', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('光熱費', '#F59E0B', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('通信費', '#10B981', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('医療費', '#EC4899', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('教育費', '#06B6D4', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('その他', '#6B7280', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1));

-- 収入用カテゴリ
INSERT INTO public.categories (name, color, user_id) VALUES
('給与', '#10B981', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('ボーナス', '#8B5CF6', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('副業', '#F59E0B', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('投資', '#3B82F6', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)),
('その他収入', '#6B7280', (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1));

-- 作成されたカテゴリを確認
SELECT 
    id,
    name,
    color,
    user_id,
    created_at
FROM public.categories 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test2@example.com' LIMIT 1)
ORDER BY name;
