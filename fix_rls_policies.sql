-- ========================================
-- RLSポリシーの無限再帰エラーを修正
-- ========================================

-- Step 1: 問題のあるポリシーを削除
DROP POLICY IF EXISTS "Users can view group members of groups they belong to" ON public.group_members;
DROP POLICY IF EXISTS "Group owners can manage members" ON public.group_members;

-- Step 2: 正しいポリシーを作成
-- グループメンバーポリシー（修正版）
CREATE POLICY "Users can view group members of groups they belong to" ON public.group_members
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_members.group_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Group owners can manage members" ON public.group_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_members.group_id AND owner_id = auth.uid()
        )
    );

-- Step 3: 他のテーブルのポリシーも確認・修正
-- 取引テーブルのポリシーを修正（既存のポリシーをすべて削除）
DROP POLICY IF EXISTS "Users can view transactions in their groups" ON public.transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own transactions" ON public.transactions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own transactions" ON public.transactions
    FOR DELETE USING (user_id = auth.uid());

-- Step 4: カテゴリテーブルのポリシーを確認
-- カテゴリポリシーは既に正しく設定されているはずですが、念のため確認
DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

CREATE POLICY "Users can view their own categories" ON public.categories
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own categories" ON public.categories
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own categories" ON public.categories
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own categories" ON public.categories
    FOR DELETE USING (user_id = auth.uid());

-- Step 5: スキーマキャッシュをリフレッシュ
NOTIFY pgrst, 'reload schema';

-- Step 6: 完了メッセージ
SELECT 
    'RLSポリシー修正完了' as status,
    '無限再帰エラーが修正されました' as message,
    NOW() as timestamp;
