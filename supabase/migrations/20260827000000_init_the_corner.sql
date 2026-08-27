-- =========================================================================
-- THE CORNER (MCBO) — MIGRACIÓN INICIAL AUTOMÁTICA
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Configuración
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de config" ON public.app_config
  FOR SELECT USING (true);

CREATE POLICY "Permitir actualización a autenticados" ON public.app_config
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

INSERT INTO public.app_config (key, value) VALUES
  ('bcv_rate', '{"rate": 70.5, "updated_at": "2026-08-27"}'::jsonb),
  ('contact', '{"phone": "+58 412 0308674", "whatsapp": "584120308674", "instagram": "@cornermcbo", "address": "Calle 72 con Av. 10, Maracaibo"}'::jsonb),
  ('venue_status', '{"is_open": true, "hours": "Miércoles a Domingos: 5:30 PM - 12:00 AM"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Reservas
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  table_number TEXT DEFAULT 'Por Asignar',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  pax INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmada', 'en_mesa', 'finalizada', 'cancelada')),
  total_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_ves NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  game_in_play TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.bookings (code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir crear reservas públicas" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir consultar reservas" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Permitir modificar reservas a staff" ON public.bookings
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 3. Menú
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pociones', 'cervezas-shots', 'munchies', 'mocktails-cafe', 'postres')),
  description TEXT NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  badge TEXT,
  spicy BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública del menú" ON public.menu_items
  FOR SELECT USING (true);

CREATE POLICY "Permitir gestión de menú a staff" ON public.menu_items
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 4. Ludoteca
CREATE TABLE IF NOT EXISTS public.board_games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  players TEXT NOT NULL,
  duration TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Principiante', 'Intermedio', 'Experto')),
  description TEXT NOT NULL,
  rules_summary TEXT NOT NULL,
  badge TEXT,
  popular BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'en_mesa', 'mantenimiento')),
  current_table TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.board_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de ludoteca" ON public.board_games
  FOR SELECT USING (true);

CREATE POLICY "Permitir administración de juegos a staff" ON public.board_games
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 5. Comandas
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  order_type TEXT NOT NULL CHECK (order_type IN ('mesa', 'pickup', 'reserva')),
  table_number TEXT,
  items JSONB NOT NULL,
  subtotal_usd NUMERIC(10, 2) NOT NULL,
  tip_usd NUMERIC(10, 2) DEFAULT 0.00,
  total_usd NUMERIC(10, 2) NOT NULL,
  total_ves NUMERIC(12, 2) NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'recibido' CHECK (status IN ('recibido', 'en_preparacion', 'servido', 'pagado', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir crear pedidos públicos" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura de pedidos" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Permitir gestionar pedidos a staff" ON public.orders
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 6. Trigger updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
