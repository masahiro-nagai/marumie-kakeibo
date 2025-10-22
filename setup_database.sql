-- ========================================
-- みらいまる見え家計簿 - データベースセットアップ
-- ========================================

-- Step 1: UUID拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: カテゴリテーブル
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: グループテーブル
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: グループメンバーテーブル
CREATE TABLE public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Step 5: グループ招待テーブル
CREATE TABLE public.group_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    email VARCHAR(255) NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Step 6: 取引テーブル
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: インデックスの作成
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_invitations_group_id ON public.group_invitations(group_id);
CREATE INDEX idx_group_invitations_email ON public.group_invitations(email);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_group_id ON public.transactions(group_id);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);

-- Step 8: Row Level Security (RLS) の有効化
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Step 9: RLSポリシーの作成

-- カテゴリポリシー
CREATE POLICY "Users can view their own categories" ON public.categories
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own categories" ON public.categories
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own categories" ON public.categories
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own categories" ON public.categories
    FOR DELETE USING (user_id = auth.uid());

-- グループポリシー
CREATE POLICY "Users can view groups they own or are members of" ON public.groups
    FOR SELECT USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_id = groups.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert groups they own" ON public.groups
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update groups they own" ON public.groups
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete groups they own" ON public.groups
    FOR DELETE USING (owner_id = auth.uid());

-- グループメンバーポリシー
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

-- グループ招待ポリシー
CREATE POLICY "Users can view invitations to their groups" ON public.group_invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_invitations.group_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Group owners can manage invitations" ON public.group_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_invitations.group_id AND owner_id = auth.uid()
        )
    );

-- 取引ポリシー
CREATE POLICY "Users can view transactions in their groups" ON public.transactions
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_id = transactions.group_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own transactions" ON public.transactions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own transactions" ON public.transactions
    FOR DELETE USING (user_id = auth.uid());

-- Step 10: スキーマキャッシュのリフレッシュ
NOTIFY pgrst, 'reload schema';

-- Step 11: 完了メッセージ
SELECT 
    'データベースセットアップ完了' as status,
    'すべてのテーブルとポリシーが作成されました' as message,
    NOW() as timestamp;

