-- ========================================
-- 問題のあるRLSを一時的に無効化
-- ========================================

-- Step 1: 問題のあるテーブルのRLSを無効化
ALTER TABLE public.group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups DISABLE ROW LEVEL SECURITY;

-- Step 2: 基本的なテーブルのRLSは有効のまま
-- categories と transactions のRLSは有効のまま

-- Step 3: スキーマキャッシュをリフレッシュ
NOTIFY pgrst, 'reload schema';

-- Step 4: 完了メッセージ
SELECT 
    'RLS一時無効化完了' as status,
    '問題のあるテーブルのRLSを無効化しました' as message,
    NOW() as timestamp;
