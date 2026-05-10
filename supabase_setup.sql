-- SUPABASE SETUP SCRIPT FOR GUGAN FURNITURE
-- Run this in Supabase SQL Editor before deploying the live client demo.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. User profile table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT DEFAULT 'GUGAN',
  category TEXT NOT NULL,
  fabric TEXT,
  price NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  variants JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  customer_details JSONB,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'ORDER_PLACED' CHECK (status IN ('ORDER_PLACED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Homepage CMS config
CREATE TABLE IF NOT EXISTS public.homepage_config (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row level security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Config" ON public.homepage_config;
DROP POLICY IF EXISTS "Profiles self access" ON public.profiles;
DROP POLICY IF EXISTS "Orders self read" ON public.orders;

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Config" ON public.homepage_config FOR SELECT USING (true);
CREATE POLICY "Profiles self access" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Orders self read" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- For client demo/admin editing through anon client.
-- Tighten these later before production by checking profiles.role = 'admin'.
DROP POLICY IF EXISTS "Demo write products" ON public.products;
DROP POLICY IF EXISTS "Demo write config" ON public.homepage_config;
DROP POLICY IF EXISTS "Demo write orders" ON public.orders;
CREATE POLICY "Demo write products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo write config" ON public.homepage_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo write orders" ON public.orders FOR INSERT WITH CHECK (true);

-- 6. updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
DROP TRIGGER IF EXISTS update_products_modtime ON public.products;
DROP TRIGGER IF EXISTS update_orders_modtime ON public.orders;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 7. Furniture homepage seed
INSERT INTO public.homepage_config (id, data)
VALUES
('hero', '{
  "headline": "COMFORTABLE HOMES START HERE",
  "subtext": "Room-ready furniture for every corner",
  "buttonText": "SHOP NOW",
  "link": "/shop",
  "visible": true
}'::jsonb),
('categories', '{
  "title": "Gugan Furniture Collection",
  "items": [
    {"name": "Living Room", "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop", "link": "/shop?category=Living%20Room"},
    {"name": "Bedroom", "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop", "link": "/shop?category=Bedroom"},
    {"name": "Dining", "image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=600&auto=format&fit=crop", "link": "/shop?category=Dining"},
    {"name": "Office", "image": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600&auto=format&fit=crop", "link": "/shop?category=Office"}
  ]
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- 8. Profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
