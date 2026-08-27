-- =========================================================================
-- THE CORNER (MCBO) — ESQUEMA COMPLETO DE BASE DE DATOS (SUPABASE / POSTGRESQL)
-- WebApp: Drinks · Board Games · Pociones Mágicas · Reservas QR
-- =========================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. TABLA: CONFIGURACIÓN GENERAL (Tasa BCV, Contactos, Horarios)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Políticas: Lectura pública, actualización autenticada / service role
CREATE POLICY "Permitir lectura pública de config" ON public.app_config
  FOR SELECT USING (true);

CREATE POLICY "Permitir actualización a autenticados" ON public.app_config
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Datos iniciales de configuración
INSERT INTO public.app_config (key, value) VALUES
  ('bcv_rate', '{"rate": 70.5, "updated_at": "2026-08-27"}'::jsonb),
  ('contact', '{"phone": "+58 412 0308674", "whatsapp": "584120308674", "instagram": "@cornermcbo", "address": "Calle 72 con Av. 10, Maracaibo"}'::jsonb),
  ('venue_status', '{"is_open": true, "hours": "Miércoles a Domingos: 5:30 PM - 12:00 AM"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =========================================================================
-- 3. TABLA: RESERVAS Y PASES VIP CON QR (bookings)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- ej: CRN-8492
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  plan_id TEXT NOT NULL, -- ej: mesa-gamer-ludoteca, salon-vip-mazmorra
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

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.bookings (code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);

-- Habilitar RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Políticas de Reservas:
-- 1. Cualquier cliente puede crear (INSERT) su reserva
CREATE POLICY "Permitir crear reservas públicas" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- 2. Lectura pública por código o ID (para visualizar el pase QR)
CREATE POLICY "Permitir consultar reservas" ON public.bookings
  FOR SELECT USING (true);

-- 3. Edición de estado para administradores / staff
CREATE POLICY "Permitir modificar reservas a staff" ON public.bookings
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Datos semilla de reservas
INSERT INTO public.bookings (code, client_name, client_phone, plan_id, plan_name, table_number, date, time, pax, status, total_usd, total_ves, notes, game_in_play)
VALUES
  ('CRN-801', 'Luis Ignacio Torres', '+58 414 6321980', 'mesa-gamer-ludoteca', 'Mesa Gamer con Ludoteca Ilimitada', 'Mesa 4 (Gamer Lounge)', 'Hoy', '06:30 PM', 4, 'en_mesa', 35.00, 2467.50, 'Cumpleaños de amigo', 'Los Colonos de Catan'),
  ('CRN-802', 'Mariana Albornoz', '+58 424 6104432', 'salon-vip-mazmorra', 'Salón VIP Mazmorra / Cumpleaños', 'Salón VIP Mazmorra', 'Hoy', '08:00 PM', 12, 'confirmada', 95.00, 6697.50, 'Requieren Game Master para Secret Hitler', 'Secret Hitler'),
  ('CRN-803', 'Alejandro Colina', '+58 412 5509122', 'noche-comedia-standup', 'Mesa Noche de Stand-Up Comedy', 'Mesa 2 (Frente Escenario)', 'Hoy', '08:15 PM', 2, 'confirmada', 25.00, 1762.50, NULL, NULL),
  ('CRN-804', 'Valeria Gutiérrez', '+58 414 7788112', 'mesa-gamer-ludoteca', 'Mesa Gamer con Ludoteca Ilimitada', 'Mesa 8', 'Hoy', '09:00 PM', 5, 'pendiente', 45.00, 3172.50, 'Primera vez jugando D&D', NULL)
ON CONFLICT (code) DO NOTHING;

-- =========================================================================
-- 4. TABLA: CATÁLOGO DE MENÚ, POCIONES & MUNCHIES (menu_items)
-- =========================================================================
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

-- Habilitar RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública del menú" ON public.menu_items
  FOR SELECT USING (true);

CREATE POLICY "Permitir gestión de menú a staff" ON public.menu_items
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Datos semilla del Menú
INSERT INTO public.menu_items (id, name, category, description, price_usd, badge, spicy, popular, tags)
VALUES
  ('pocion-mana-blue', 'Poción Maná Azul (Signature UV)', 'pociones', 'Ginebra premium, licor de moras azules, tónica y glitter comestible que brilla bajo luz UV.', 7.50, 'Brilla en la Oscuridad', false, true, ARRAY['Glitter UV', 'Ginebra', 'Top 1']),
  ('pocion-vida-roja', 'Poción de Curación HP (+100 Vida)', 'pociones', 'Vodka infusionado en fresas, flor de saúco, reducción de frutos rojos y perlas explosivas.', 7.00, 'Restaura Vida', false, true, ARRAY['Dulce', 'Vodka', 'Perlas Pop']),
  ('dragon-breath-flame', 'Aliento de Dragón (Flameado)', 'pociones', 'Ron añejo especiado venezolano, maracuyá, sirope de canela y flameado en mesa.', 8.50, 'Show con Fuego', true, true, ARRAY['Flameado', 'Ron', 'Espectacular']),
  ('elixir-invisibilidad', 'Elixir de la Invisibilidad', 'pociones', 'Tequila 100% agave, pepino, albahaca y esfera de humo aromático encapsulada.', 8.00, 'Burbuja de Humo', false, false, ARRAY['Tequila', 'Burbuja Mágica']),
  ('101-corner-mule', '101 Corner Mule Gamer', 'pociones', 'Vodka artesanal, cerveza de jengibre picante y lima fresca en jarro de cobre helado.', 6.50, NULL, false, false, ARRAY['Jarro de Cobre', 'Jengibre']),
  ('balde-polar-6', 'Balde Gamer: 6 Polar Pilsen / Light', 'cervezas-shots', 'Balde metálico lleno de hielo con 6 botellitas bien vestidas de novia.', 9.00, 'Combo Rápido', false, true, ARRAY['Cerveza Nacional', '6 Unidades']),
  ('balde-corona-extra-6', 'Balde Premium: 6 Corona Extra', 'cervezas-shots', '6 botellas de Corona Extra servidas en cubeta de hielo con limas.', 14.00, NULL, false, false, ARRAY['Importada', 'Corona']),
  ('ronda-5-shots-d20', 'Ronda Crítica D20: 5 Shots de Tequila', 'cervezas-shots', '5 shots de tequila servidos en bandeja temática de dados de rol con sal de gusano.', 12.00, 'Tira el D20', false, true, ARRAY['Shots', 'Tequila']),
  ('nachos-volcanicos-corner', 'Nachos Volcánicos de la Mazmorra', 'munchies', 'Totopos con doble cheddar fundido, carne sazonada, frijoles, pico de gallo y guacamole.', 11.50, 'Plato Más Pedido', false, true, ARRAY['Para Compartir', 'Cheddar', 'Guacamole']),
  ('smash-burger-dragon', 'Smash Burger Dragón Doble Angus', 'munchies', 'Doble carne Angus smash (160g), cheddar madurado, tocineta y salsa secreta con papas.', 10.50, NULL, false, true, ARRAY['Angus', 'Brioche', 'Papas']),
  ('tequenos-gamer-truffle', 'Tequeños Gigantes Gamer (6 Unidades)', 'munchies', '6 tequeños extra grandes con queso de mano y dip tártara trufada.', 8.00, 'Infaltables', false, true, ARRAY['Queso de Mano', 'Trufa']),
  ('cesta-12-alitas-bbq-habanero', 'Cesta de 12 Alitas BBQ o Búfalo', 'munchies', 'Alitas extra crujientes glaseadas con salsa BBQ o búfalo y aderezo ranch.', 13.00, NULL, true, false, ARRAY['Alitas', 'BBQ Ahumada']),
  ('pocion-revivir-mocktail', 'Poción de Revivir (Mocktail Sin Alcohol)', 'mocktails-cafe', 'Puré natural de maracuyá, frutos rojos, hierbabuena y soda tónica.', 4.50, '0% Alcohol', false, false, ARRAY['Sin Alcohol', 'Refrescante']),
  ('cold-brew-nitro-caramel', 'Cold Brew Nitro Vainilla & Caramelo', 'mocktails-cafe', 'Café de especialidad venezolano macerado en frío por 18h con caramelo salado.', 4.00, NULL, false, false, ARRAY['Café Especialidad', 'Nitro']),
  ('volcan-chocolate-corner', 'Volcán de Lava de Chocolate con Helado', 'postres', 'Bizcocho tibio con centro líquido derretido y bola de helado de mantecado.', 6.00, 'Delicioso', false, false, ARRAY['Chocolate Líquido', 'Helado'])
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 5. TABLA: LUDOTECA & JUEGOS DE MESA (board_games)
-- =========================================================================
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

-- Habilitar RLS
ALTER TABLE public.board_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de ludoteca" ON public.board_games
  FOR SELECT USING (true);

CREATE POLICY "Permitir administración de juegos a staff" ON public.board_games
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Datos semilla de Juegos de Mesa
INSERT INTO public.board_games (id, name, category, players, duration, difficulty, description, rules_summary, badge, popular, status, current_table, tags)
VALUES
  ('catan', 'Los Colonos de Catan', 'estrategia', '3 a 4 jugadores', '60 - 90 min', 'Intermedio', 'Comercia trigo, madera, ladrillo y mineral para construir poblados y ciudades.', 'Tira dados, negocia recursos y acumula 10 puntos de victoria.', 'Top 1 Ludoteca', true, 'en_mesa', 'Mesa 4', ARRAY['Estrategia', 'Comercio', 'Clásico']),
  ('carcassonne', 'Carcassonne', 'estrategia', '2 a 5 jugadores', '35 - 45 min', 'Principiante', 'Construye castillos medievales, monasterios y caminos loseta a loseta.', 'Roba una loseta, encájala y coloca tus meeples para puntuar.', 'Fácil de Aprender', true, 'disponible', NULL, ARRAY['Losetas', 'Meeples', 'Familiar']),
  ('ticket-to-ride', 'Ticket to Ride', 'estrategia', '2 a 5 jugadores', '45 - 60 min', 'Principiante', 'Conecta ciudades construyendo rutas de ferrocarril con vagones de colores.', 'Colecciona cartas de trenes y cumple tus billetes de destino secreto.', 'Familiar Top', true, 'disponible', NULL, ARRAY['Trenes', 'Estratégico']),
  ('azul', 'Azul: El Arte de los Azulejos', 'estrategia', '2 a 4 jugadores', '30 - 45 min', 'Principiante', 'Reclama azulejos de cerámica y decora las paredes del palacio real de Évora.', 'Elige piezas de las fábricas y planifica mosaicos sin desperdicios.', 'Spiel des Jahres', true, 'disponible', NULL, ARRAY['Abstracto', 'Patrones', 'Precioso']),
  ('codenames', 'Codenames (Código Secreto)', 'party', '4 a 10+ jugadores', '15 - 20 min', 'Principiante', 'Dos espías rivales guían a sus equipos con pistas de 1 sola palabra para contactar agentes.', 'Pista: 1 palabra + 1 número. Evita tocar al asesino.', 'Rey de las Fiestas', true, 'disponible', NULL, ARRAY['Palabras', 'Deducción', 'Equipos']),
  ('dixit', 'Dixit: Odisea', 'party', '3 a 8 jugadores', '30 min', 'Principiante', 'Cartas ilustradas surrealistas y poesía. El narrador da una pista sutil.', 'Adivina la carta del narrador sin que sea obvia para todos.', 'Visualmente Mágico', true, 'disponible', NULL, ARRAY['Imaginación', 'Arte']),
  ('exploding-kittens', 'Exploding Kittens', 'party', '2 a 5 jugadores', '15 min', 'Principiante', 'Ruleta rusa gatuna. Roba cartas hasta que alguien saca la bomba.', 'Usa lásers, sándwiches de hierba gatera y ataques para salvarte.', 'Risas Garantizadas', true, 'disponible', NULL, ARRAY['Humor', 'Gatitos', 'Rápido']),
  ('secret-hitler', 'Secret Hitler', 'party', '5 a 10 jugadores', '45 min', 'Intermedio', 'Deducción política y engaño entre liberales y fascistas con roles ocultos.', 'Elige presidente y canciller, promulga leyes y descubre traidores.', 'Top Roles Ocultos', true, 'en_mesa', 'Salón VIP Mazmorra', ARRAY['Roles Ocultos', 'Engaño']),
  ('taco-gato-cabra-queso-pizza', 'Taco Gato Cabra Queso Pizza', 'party', '3 a 8 jugadores', '10 min', 'Principiante', 'Reflejos instantáneos y bofetadas a la mesa al coincidir palabra y carta.', 'Sigue la secuencia y golpea la mesa a toda velocidad.', 'Caos Total', true, 'disponible', NULL, ARRAY['Reflejos', 'Bofetadas']),
  ('pandemic', 'Pandemic: Salva el Planeta', 'cooperativo', '2 a 4 jugadores', '45 min', 'Intermedio', 'Equipo del CDC combatiendo juntos 4 epidemias globales.', 'Combina habilidades de personajes y descubre las 4 curas.', 'Top Cooperativo', true, 'disponible', NULL, ARRAY['Cooperativo', 'Tensión']),
  ('dnd-starter', 'Dungeons & Dragons 5e Starter', 'rol-dnd', '3 a 6 jugadores', '90 - 180 min', 'Intermedio', 'El juego de rol más épico con Game Master, dados D20 y miniaturas en mesa.', 'Declara tus acciones, tira el D20 y sumérgete en la mazmorra.', 'Experiencia Estrella', true, 'disponible', NULL, ARRAY['Rol', 'D&D 5e', 'Game Master']),
  ('7-wonders-duel', '7 Wonders Duel', 'duelos-1v1', '2 jugadores', '30 min', 'Intermedio', 'Supremacía militar, científica o civil en el mejor duelo para 2 personas.', 'Draftea cartas de la pirámide y erige maravillas del mundo.', 'Mejor para Parejas', true, 'disponible', NULL, ARRAY['Duelo 1v1', 'Estrategia']),
  ('radlands', 'Radlands: Duelo Cyberpunk', 'duelos-1v1', '2 jugadores', '20 - 30 min', 'Intermedio', 'Duelo postapocalíptico de cartas con estética flúor neón increíble.', 'Gestiona agua potable y destruye los 3 campamentos enemigos.', 'Flúor Neón', true, 'en_mesa', 'Mesa 2 (Barra)', ARRAY['Cyberpunk', 'Duelo', 'Agua'])
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 6. TABLA: COMANDAS Y PEDIDOS DIGITALES (orders)
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

-- Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir crear pedidos públicos" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura de pedidos" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Permitir gestionar pedidos a staff" ON public.orders
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- =========================================================================
-- 7. TABLA: USUARIOS Y ROLES DE STAFF (staff_users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.staff_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Gerente General', 'Game Master', 'Barra / Mixología', 'Validador Puerta')),
  status TEXT NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso a staff autenticado" ON public.staff_users
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

INSERT INTO public.staff_users (name, email, role, status) VALUES
  ('Paul David (Gerente)', 'gerencia@thecornermcbo.com', 'Gerente General', 'Activo'),
  ('Andrea Colina', 'andrea.gm@thecornermcbo.com', 'Game Master', 'Activo'),
  ('Carlos Villalobos', 'mixologia@thecornermcbo.com', 'Barra / Mixología', 'Activo'),
  ('Validador Nocturno', 'puerta@thecornermcbo.com', 'Validador Puerta', 'Activo')
ON CONFLICT (email) DO NOTHING;

-- =========================================================================
-- 8. TRIGGER AUTOMÁTICO: ACTUALIZAR updated_at
-- =========================================================================
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
