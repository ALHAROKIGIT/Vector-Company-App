-- ============================================
-- Vector Company PWA — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================

-- 1. TABLES
-- ============================================

-- Users table (linked to Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  vector_balance INTEGER NOT NULL DEFAULT 0 CHECK (vector_balance >= 0),
  vector_points INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. INDEXES
-- ============================================
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);

-- 3. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users: members can only read their own row
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users: admins can read all rows
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT role = 'admin' FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE POLICY "Admins can read all profiles"
  ON public.users FOR SELECT
  USING (public.is_admin());

-- Transactions: members can read own transactions
CREATE POLICY "Users can read own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Transactions: admins can read all transactions
CREATE POLICY "Admins can read all transactions"
  ON public.transactions FOR SELECT
  USING (public.is_admin());

-- 4. AUTO-CREATE USER ON SIGNUP (Trigger)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RPC: process_payment
-- ============================================

CREATE OR REPLACE FUNCTION public.process_payment(
  target_user_id UUID,
  deduction_amount INTEGER
)
RETURNS JSON AS $$
DECLARE
  current_balance INTEGER;
  points_earned INTEGER;
  target_name TEXT;
BEGIN
  -- Validate admin role
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can process payments';
  END IF;

  -- Validate deduction amount
  IF deduction_amount <= 0 THEN
    RAISE EXCEPTION 'Deduction amount must be positive';
  END IF;

  -- Get current balance with row lock
  SELECT vector_balance, full_name INTO current_balance, target_name
  FROM public.users
  WHERE id = target_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF current_balance < deduction_amount THEN
    RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', current_balance, deduction_amount;
  END IF;

  -- Calculate points (5% of deduction)
  points_earned := GREATEST(1, FLOOR(deduction_amount * 0.05));

  -- Deduct balance and add points
  UPDATE public.users
  SET
    vector_balance = vector_balance - deduction_amount,
    vector_points = vector_points + points_earned
  WHERE id = target_user_id;

  -- Log transaction
  INSERT INTO public.transactions (user_id, amount, description)
  VALUES (
    target_user_id,
    deduction_amount,
    'Pembayaran cetak — ' || deduction_amount || ' Vector dikurangi, ' || points_earned || ' poin diperoleh'
  );

  RETURN json_build_object(
    'success', true,
    'user_name', target_name,
    'deducted', deduction_amount,
    'points_earned', points_earned,
    'new_balance', current_balance - deduction_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
