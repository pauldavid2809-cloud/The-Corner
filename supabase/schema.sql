-- =========================================================================
-- THE CORNER (MCBO) — ESQUEMA COMPLETO DE BASE DE DATOS PARA SUPABASE
-- WebApp: Drinks · Narguiles · Beerpong · Mario Kart · Reservas QR · Pagos
-- Proyecto: nvrdcamlzjfojbvbyzp (https://nvrdcamlzjfojbvbyzp.supabase.co)
-- =========================================================================

-- 1. EXTENSIÓN UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. TABLA: CONFIGURACIÓN GENERAL (Tasa BCV, Contactos, Horarios)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública de config" ON public.app_config;
CREATE POLICY "Permitir lectura pública de config" ON public.app_config
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir actualización a autenticados" ON public.app_config;
CREATE POLICY "Permitir actualización a autenticados" ON public.app_config
  FOR ALL USING (true);

INSERT INTO public.app_config (key, value) VALUES
  ('bcv_rate', '{"rate": 76.8, "updated_at": "2026-08-27"}'::jsonb),
  ('contact', '{"phone": "+58 412 0308674", "whatsapp": "584120308674", "instagram": "@cornermcbo", "address": "C.C. Costa Verde, Local PA-35-36, Planta Alta, Maracaibo"}'::jsonb),
  ('venue_status', '{"is_open": true, "hours": "Miércoles a Domingos: 6:00 PM - 03:00 AM"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =========================================================================
-- 3. TABLA: RESERVAS, PASES QR & CONCILIACIÓN DE PAGOS (bookings)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- ej: CRN-8492
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  plan_id TEXT NOT NULL, -- ej: paquete-1, paquete-2, paquete-3, paquete-4
  plan_name TEXT NOT NULL,
  table_number TEXT DEFAULT 'Por Asignar',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  pax INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmada', 'en_mesa', 'finalizada', 'cancelada')),
  total_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_ves NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  game_in_play TEXT,
  -- Datos de Pago & Conciliación (Estilo Parrandón)
  payment_method TEXT NOT NULL DEFAULT 'pago_movil' CHECK (payment_method IN ('pago_movil', 'zelle', 'binance', 'efectivo')),
  payment_reference TEXT,
  payment_bank TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pendiente' CHECK (payment_status IN ('pendiente', 'aprobado', 'rechazado')),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.bookings (code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings (payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir crear reservas públicas" ON public.bookings;
CREATE POLICY "Permitir crear reservas públicas" ON public.bookings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir consultar reservas" ON public.bookings;
CREATE POLICY "Permitir consultar reservas" ON public.bookings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir modificar reservas a staff" ON public.bookings;
CREATE POLICY "Permitir modificar reservas a staff" ON public.bookings
  FOR ALL USING (true);

-- Semilla de Reservas Iniciales
INSERT INTO public.bookings (code, client_name, client_phone, plan_id, plan_name, table_number, date, time, pax, status, total_usd, total_ves, payment_method, payment_reference, payment_bank, payment_status, approved_by)
VALUES
  ('CRN-801', 'Luis Ignacio Torres', '+58 414 6321980', 'paquete-1', 'Paquete 1 (5 Personas) - Cumpleaños', 'Mesa 4 (Costa Verde)', 'Hoy', '08:00 PM', 5, 'en_mesa', 50.00, 3840.00, 'pago_movil', '849201', 'Banesco', 'aprobado', 'Gerente General'),
  ('CRN-802', 'Mariana Albornoz', '+58 424 6104432', 'paquete-3', 'Paquete 3 (15 Personas) - Mario Kart VIP', 'Salón VIP Planta Alta', 'Hoy', '08:30 PM', 15, 'confirmada', 85.00, 6528.00, 'zelle', 'ZLL-948102', 'Chase Bank', 'pendiente', NULL),
  ('CRN-803', 'Alejandro Colina', '+58 412 5509122', 'paquete-2', 'Paquete 2 (10 Personas) - Cumpleaños', 'Mesa 2', 'Hoy', '09:00 PM', 10, 'pendiente', 70.00, 5376.00, 'pago_movil', '109482', 'Mercantil', 'pendiente', NULL)
ON CONFLICT (code) DO NOTHING;

-- =========================================================================
-- 4. TABLA: MENÚ, PROMOS & MUNCHIES (menu_items)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('combos-promos', 'narguiles-shots', 'baldes-cervezas', 'cocteles-botellas', 'comida-munchies')),
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

DROP POLICY IF EXISTS "Permitir lectura pública del menú" ON public.menu_items;
CREATE POLICY "Permitir lectura pública del menú" ON public.menu_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gestión de menú a staff" ON public.menu_items;
CREATE POLICY "Permitir gestión de menú a staff" ON public.menu_items
  FOR ALL USING (true);

-- Datos semilla del Menú Real de The Corner
INSERT INTO public.menu_items (id, name, category, description, price_usd, badge, popular, tags)
VALUES
  ('promo-balde-10-cervezas', 'Promo Toda la Noche: Balde 10 Cervezas Polar', 'combos-promos', 'Balde con hielo y 10 cervezas Polar Pilsen o Light. Válido Miércoles, Jueves y Domingos.', 10.00, '10 Cervezas x 10$', true, ARRAY['Polar', 'Mié, Jue, Dom']),
  ('promo-narguile-balde-pilsen', 'Promo Narguile + Balde de Pilsen', 'combos-promos', '1 Narguile con sabor frutal + Balde de 6 cervezas Polar Pilsen heladas.', 12.00, 'Ref. 12$', true, ARRAY['Narguile', 'Balde Pilsen']),
  ('promo-2-perros-corner', 'Promo 2 Perros Corner con Papitas', 'combos-promos', '2 perros calientes con papitas ralladas, queso y trío de salsas.', 5.00, '2 x 5$', true, ARRAY['2 Perros', 'Económico']),
  ('promo-3-burgers-papas', 'Promo 3 Hamburguesas (Crispy o Carne) + Papas', 'combos-promos', '3 hamburguesas con queso, vegetales y salsas, con papas fritas incluidas.', 15.00, '3 Burgers x 15$', true, ARRAY['3 Burgers', 'Papas']),
  ('parrilla-corner-completa', 'Parrilla Corner (2 Contornos + Ensalada)', 'comida-munchies', 'Carne a la parrilla, pollo y chorizo con yuca/papas y ensalada con guasacaca.', 9.00, 'Desde 9$', true, ARRAY['Parrilla', 'Carbón']),
  ('narguile-sesion-premium', 'Sesión de Narguile / Hookah Premium', 'narguiles-shots', 'Hookah con carbón de coco natural. Sabores: Menta Helada, Love 66, Uva, Fresa y Blue Mist.', 8.00, 'Sabores Frutales', true, ARRAY['Carbón de Coco', 'Hookah']),
  ('ronda-shots-power-rangers', 'Ronda de Shots Power Rangers (5 Shots)', 'narguiles-shots', '5 shots multicolor temáticos para prender la mesa con tus amigos.', 10.00, '5 Shots', true, ARRAY['Multicolor', 'Shots']),
  ('beerpong-mesa-juego', 'Juego de Beerpong (Vasos + Cerveza)', 'narguiles-shots', 'Mesa oficial de Beerpong, 10 vasos rojos, pelotas y jarra de cerveza bien fría.', 10.00, 'Juego Oficial', true, ARRAY['Beerpong', 'Rumba']),
  ('happy-hour-coctel-2x1', 'Happy Hour 2x1 en Cócteles de Selección', 'cocteles-botellas', 'Mojitos, Cuba Libre o Daiquirís. Válido Viernes y Sábados 8PM-11PM.', 6.00, '2x1 Happy Hour', true, ARRAY['2x1', 'Mojito']),
  ('servicio-tequenos-gourmet', 'Servicio de Tequeños con Tártara (6 Uds)', 'comida-munchies', '6 tequeños doraditos con abundante queso derretido y salsa tártara.', 5.00, 'Top Piqueo', true, ARRAY['Tequeños', 'Tártara'])
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 5. TABLA: JUEGOS DE MESA & ARCADE (board_games)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.board_games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  players TEXT NOT NULL,
  duration TEXT NOT NULL,
  difficulty TEXT NOT NULL,
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

DROP POLICY IF EXISTS "Permitir lectura pública de ludoteca" ON public.board_games;
CREATE POLICY "Permitir lectura pública de ludoteca" ON public.board_games
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir administración de juegos a staff" ON public.board_games;
CREATE POLICY "Permitir administración de juegos a staff" ON public.board_games
  FOR ALL USING (true);

INSERT INTO public.board_games (id, name, category, players, duration, difficulty, description, rules_summary, badge, popular, tags)
VALUES
  ('mario-kart-8-arcade', 'Mario Kart 8 Deluxe (Pantalla Gigante)', 'videojuegos-arcade', '2 a 4 jugadores', '15 - 30 min', 'Fácil & Rápido', 'Compite en pantalla gigante de Nintendo Switch con tus amigos.', 'Elige tu personaje y circuito. 4 mandos inalámbricos listos.', 'Top Videojuegos', true, ARRAY['Nintendo Switch', 'Pantalla Gigante']),
  ('beerpong-torneo', 'Mesa Oficial de Beerpong', 'beerpong-retos', '2 a 4 jugadores', '15 - 20 min', 'Competitivo', 'Encesta en los vasos contrarios y haz beber a tus rivales.', 'Lanza por turnos y elimina los vasos del oponente.', 'Rey de la Fiesta', true, ARRAY['Beerpong', 'Retos']),
  ('jenga-retos-corner', 'Jenga con Retos Corner & Castigos', 'party', '2 a 8 jugadores', '15 - 25 min', 'Fácil & Rápido', 'Torre de madera con retos y shots en cada bloque.', 'Saca un bloque con una mano y cumple el reto en voz alta.', 'Cócteles + Jenga', true, ARRAY['Retos', 'Shots'])
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 6. TABLA: COMANDAS DIGITALES (orders)
-- =========================================================================
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

DROP POLICY IF EXISTS "Permitir crear pedidos públicos" ON public.orders;
CREATE POLICY "Permitir crear pedidos públicos" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura de pedidos" ON public.orders;
CREATE POLICY "Permitir lectura de pedidos" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gestionar pedidos a staff" ON public.orders;
CREATE POLICY "Permitir gestionar pedidos a staff" ON public.orders
  FOR ALL USING (true);

-- =========================================================================
-- 7. TRIGGER: ACTUALIZACIÓN AUTOMÁTICA DE updated_at
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
