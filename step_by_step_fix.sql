-- ========================================
-- 段階的RLSポリシー修正（安全版）
-- ========================================

-- Step 1: 既存のポリシーをすべて削除
DROP POLICY IF EXISTS "Users can view group members of groups they belong to" ON public.group_members;
DROP POLICY IF EXISTS "Group owners can manage members" ON public.group_members;
DROP POLICY IF EXISTS "Users can view transactions in their groups" ON public.transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

-- Step 2: 基本的なテーブルのRLSを有効化
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Step 3: カテゴリテーブルのポリシーを作成
CREATE POLICY "Users can view their own categories" ON public.categories
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own categories" ON public.categories
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own categories" ON public.categories
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own categories" ON public.categories
    FOR DELETE USING (user_id = auth.uid());

-- Step 4: 取引テーブルのポリシーを作成
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own transactions" ON public.transactions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own transactions" ON public.transactions
    FOR DELETE USING (user_id = auth.uid());

-- Step 5: スキーマキャッシュをリフレッシュ
NOTIFY pgrst, 'reload schema';

-- Step 6: 完了メッセージ
SELECT 
    '段階的RLS修正完了' as status,
    '基本的なテーブルのRLSが正しく設定されました' as message,
    NOW() as timestamp;
