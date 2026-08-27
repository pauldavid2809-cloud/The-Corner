/**
 * Catálogo Oficial & Real de The Corner (@cornermcbo)
 * C.C. Costa Verde, Local PA-35-36, Planta Alta, Maracaibo
 * Drinks · Narguiles · Beerpong · Videojuegos · Board Games · Karaoke · Celebraciones
 */

export type PaymentMethod = "pago_movil" | "zelle" | "binance" | "efectivo";
export type PaymentStatus = "pendiente" | "aprobado" | "rechazado";

export type BoardGameCategory =
  | "todos"
  | "party"
  | "videojuegos-arcade"
  | "beerpong-retos"
  | "estrategia"
  | "duelos-1v1";

export type BoardGame = {
  id: string;
  name: string;
  category: "party" | "videojuegos-arcade" | "beerpong-retos" | "estrategia" | "duelos-1v1";
  players: string;
  duration: string;
  difficulty: "Fácil & Rápido" | "Intermedio" | "Competitivo";
  description: string;
  rulesSummary: string;
  tags: string[];
  image: string;
  badge?: string;
  popular?: boolean;
  featured?: boolean;
  minPlayers: number;
  maxPlayers: number;
  minMinutes: number;
};

export type MenuItem = {
  id: string;
  name: string;
  category: "narguiles-shots" | "baldes-cervezas" | "cocteles-botellas" | "comida-munchies" | "combos-promos";
  description: string;
  priceUSD: number;
  badge?: string;
  spicy?: boolean;
  popular?: boolean;
  tags?: string[];
  image?: string;
};

export type CelebrationPackage = {
  id: string;
  packageNumber: number;
  name: string;
  tier: "Básico" | "Premium";
  pax: string;
  priceUSD: number;
  badge?: string;
  features: string[];
  popular?: boolean;
};

export type WeeklyEvent = {
  id: string;
  day: string;
  title: string;
  subtitle: string;
  time: string;
  badge: string;
  description: string;
  icon: string;
  perk: string;
};

export type LiveBooking = {
  id: string;
  clientName: string;
  phone: string;
  planName: string;
  tableNumber: string;
  time: string;
  date: string;
  pax: number;
  status: "confirmada" | "en_mesa" | "pendiente" | "finalizada";
  totalUSD: number;
  notes?: string;
  gameInPlay?: string;
  // Campos de Gestión de Pago
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentBank?: string;
  paymentStatus: PaymentStatus;
  paymentAmountVES?: number;
  approvedAt?: string;
  approvedBy?: string;
};

export type ManagerKPIs = {
  activeTables: number;
  totalTables: number;
  gamesInPlay: number;
  totalGames: number;
  todaySalesUSD: number;
  avgTicketUSD: number;
  pendingReservationsCount: number;
  pendingPaymentsCount: number;
};

// =========================================================================
// DATOS BANCARIOS OFICIALES PARA RECEPCIÓN DE PAGOS
// =========================================================================
export const PAYMENT_ACCOUNTS = {
  pagoMovil: {
    banco: "Banesco (0134) / Banco de Venezuela (0102)",
    telefono: "0412-0308674",
    telefonoRaw: "04120308674",
    ci: "V-28.090.000",
    titular: "The Corner Drinks & Entertainment",
  },
  zelle: {
    correo: "pagos@thecornermcbo.com",
    titular: "The Corner Entertainment Group LLC",
  },
  binance: {
    payId: "84920194",
    usdtAddress: "TFCornerCostaVerde99TRC20XXXX",
    red: "USDT (TRC20 / BEP20)",
  },
  efectivo: {
    instrucciones: "Pago directo en taquilla el día del evento en C.C. Costa Verde Planta Alta (Dólares o Bolívares en efectivo).",
  },
};

// =========================================================================
// PAQUETES REALES DE CUMPLEAÑOS & CELEBRACIONES (FLYERS OFICIALES)
// =========================================================================
export const CELEBRATION_PACKAGES: CelebrationPackage[] = [
  {
    id: "paquete-1",
    packageNumber: 1,
    name: "Paquete 1 (5 Personas)",
    tier: "Básico",
    pax: "5 Personas",
    priceUSD: 50,
    badge: "Básico Ideal",
    popular: true,
    features: [
      "1 Balde de Polar Pilsen",
      "2 Servicios de Tequeños crujientes",
      "2 Servicios de Papas con Queso Cheddar",
      "5 Cócteles (Mojito, Destornillador, Cuba Libre ó Daiquirí)",
      "1 Mesa de Beerpong",
      "1 Narguile / Hookah con sabor a elección",
      "Karaoke libre, música ambiental y espacio para decorar",
    ],
  },
  {
    id: "paquete-2",
    packageNumber: 2,
    name: "Paquete 2 (10 Personas)",
    tier: "Básico",
    pax: "10 Personas",
    priceUSD: 70,
    badge: "Más Solicitado",
    popular: true,
    features: [
      "2 Baldes de Polar Pilsen",
      "1 Narguile / Hookah con carbón continuo",
      "1 Mesa de Beerpong",
      "2 Rondas de Shots 'Power Rangers' (10 shots)",
      "2 Servicios de Tequeños",
      "2 Pizzas Medianas recién horneadas",
      "Karaoke libre y atención de mesonero dedicada",
    ],
  },
  {
    id: "paquete-3",
    packageNumber: 3,
    name: "Paquete 3 (15 Personas)",
    tier: "Premium",
    pax: "15 Personas",
    priceUSD: 85,
    badge: "Premium Mario Kart",
    popular: true,
    features: [
      "1 Balde de Polar Pilsen",
      "1 Botella de Sangría artesanal de la casa",
      "1 Narguile + 1 Recarga de sabor",
      "1 Mesa de Beerpong (Cerveza, Tequila, Vodka o Ron)",
      "2 Servicios de Tequeños",
      "2 Servicios de Papas con Queso Cheddar",
      "1 Pizza Mediana + 1 Refresco de 1.5 Lts",
      "1 Servicio de Aros de Cebolla crujientes",
      "🎮 1 Torneo de Mario Kart para 4 personas (30 min en pantalla gigante)",
    ],
  },
  {
    id: "paquete-4",
    packageNumber: 4,
    name: "Paquete 4 (25 Personas)",
    tier: "Premium",
    pax: "25 Personas",
    priceUSD: 150,
    badge: "Full Rumba VIP",
    popular: true,
    features: [
      "2 Baldes de Polar Pilsen",
      "1 Botella de Ron Santa Teresa + Servicio de hielo y refresco",
      "2 Narguiles + 1 Recarga",
      "1 Mesa de Beerpong",
      "2 Servicios de Tequeños",
      "2 Servicios de Papas con Queso Cheddar",
      "3 Pizzas Medianas + 1 Refresco de 1.5 Lts",
      "1 Ronda de Shots 'Power Rangers'",
      "5 Cócteles a elección",
      "2 Servicios de Aros de Cebolla",
      "Zona VIP reservada con atención exclusiva toda la noche",
    ],
  },
];

// =========================================================================
// CARTA REAL DE MENÚ, TRAGOS, NARGUILES & MUNCHIES
// =========================================================================
export const MENU_ITEMS: MenuItem[] = [
  {
    id: "promo-balde-10-cervezas",
    name: "Promo Toda la Noche: Balde 10 Cervezas Polar",
    category: "combos-promos",
    description: "Balde metálico con hielo y 10 cervezas Polar Pilsen o Light bien frías. Válido Miércoles, Jueves y Domingos.",
    priceUSD: 10.0,
    badge: "10 Cervezas x 10$",
    popular: true,
    tags: ["Miércoles, Jueves y Domingos", "Polar Pilsen / Light", "Top Promo"],
  },
  {
    id: "promo-narguile-balde-pilsen",
    name: "Promo Narguile + Balde de Pilsen",
    category: "combos-promos",
    description: "1 Narguile con sabor premium frutal + Balde de 6 cervezas Polar Pilsen heladas.",
    priceUSD: 12.0,
    badge: "Ref. 12$",
    popular: true,
    tags: ["Narguile", "Balde Pilsen", "Plan Pareja / Amigos"],
  },
  {
    id: "promo-2-perros-corner",
    name: "Promo 2 Perros Corner con Papitas",
    category: "combos-promos",
    description: "2 perros calientes estilo callejero con salchicha premium, papitas ralladas crujientes, queso y trío de salsas especiales.",
    priceUSD: 5.0,
    badge: "2 x 5$",
    popular: true,
    tags: ["2 Perros", "Económico", "Munchie Rápido"],
  },
  {
    id: "promo-3-burgers-papas",
    name: "Promo 3 Hamburguesas (Crispy o Carne) + Papas",
    category: "combos-promos",
    description: "3 hamburguesas a elección (pollo crispy o carne a la plancha) con queso, vegetales y salsas, acompañadas de papas fritas.",
    priceUSD: 15.0,
    badge: "3 Burgers x 15$",
    popular: true,
    tags: ["3 Burgers", "Papas Fritas Incluidas", "Grupos"],
  },
  {
    id: "parrilla-corner-completa",
    name: "Parrilla Corner (2 Contornos + Ensalada)",
    category: "comida-munchies",
    description: "Carne tierna a la parrilla, pollo a la brasa y chorizo, servida con 2 contornos (yuca/papas) y ensalada fresca con guasacaca.",
    priceUSD: 9.0,
    badge: "Desde 9$",
    popular: true,
    tags: ["Parrilla", "Al Carbón", "Para Compartir"],
  },
  {
    id: "narguile-sesion-premium",
    name: "Sesión de Narguile / Hookah Premium",
    category: "narguiles-shots",
    description: "Hookah de alta calidad con carbón de coco natural. Sabores: Menta Helada, Love 66, Uva, Fresa Silvestre, Manzana Doble y Blue Mist.",
    priceUSD: 8.0,
    badge: "Sabores Frutales",
    popular: true,
    tags: ["Carbón de Coco", "Menta Helada", "Love 66"],
  },
  {
    id: "ronda-shots-power-rangers",
    name: "Ronda de Shots 'Power Rangers' (5 Shots)",
    category: "narguiles-shots",
    description: "5 shots multicolor temáticos (Rojo, Azul, Amarillo, Rosa, Verde) a base de licores premium y jugos cítricos para prender la mesa.",
    priceUSD: 10.0,
    badge: "Shots Multicolor",
    popular: true,
    tags: ["5 Shots", "Para Grupos", "Power Rangers"],
  },
  {
    id: "beerpong-mesa-juego",
    name: "Juego de Beerpong (Vasos + Cerveza / Vodka)",
    category: "narguiles-shots",
    description: "Mesa oficial de Beerpong, 10 vasos reglamentarios, pelotas y jarra de cerveza bien fría o destilado para la partida.",
    priceUSD: 10.0,
    badge: "Juego Oficial",
    popular: true,
    tags: ["Beerpong", "Vasos Rojos", "Competitivo"],
  },
  {
    id: "balde-polar-pilsen-6",
    name: "Balde de 6 Polar Pilsen / Light",
    category: "baldes-cervezas",
    description: "Cubeta con abundante hielo y 6 botellitas de Polar Pilsen o Light vestidas de novia.",
    priceUSD: 7.0,
    tags: ["Polar", "6 Cervezas", "Heladas"],
  },
  {
    id: "happy-hour-coctel-2x1",
    name: "Happy Hour 2x1 en Cócteles de Selección",
    category: "cocteles-botellas",
    description: "Mojitos cubanos, Destornilladores cítricos, Cuba Libre con limón o Daiquirís frappeados. Válido Viernes y Sábados 8PM-11PM.",
    priceUSD: 6.0,
    badge: "2x1 Happy Hour",
    popular: true,
    tags: ["2x1", "Mojito", "Daiquirí", "Vie y Sáb"],
  },
  {
    id: "servicio-tequenos-gourmet",
    name: "Servicio de Tequeños con Tártara (6 Uds)",
    category: "comida-munchies",
    description: "6 tequeños doraditos y crujientes con abundante queso derretido y salsa tártara de la casa.",
    priceUSD: 5.0,
    popular: true,
    tags: ["Queso", "Tártara", "Piqueo"],
  },
  {
    id: "papas-cheddar-tocineta",
    name: "Papas Fritas con Extra Cheddar y Tocineta",
    category: "comida-munchies",
    description: "Papas fritas crujientes bañadas en queso cheddar fundido y trocitos de tocineta crocante.",
    priceUSD: 6.0,
    tags: ["Papas", "Cheddar", "Bacon"],
  },
];

// =========================================================================
// ENTRETENIMIENTO: JUEGOS DE MESA, VIDEOJUEGOS & BEERPONG
// =========================================================================
export const BOARD_GAMES: BoardGame[] = [
  {
    id: "mario-kart-8-arcade",
    name: "Mario Kart 8 Deluxe (Pantalla Gigante)",
    category: "videojuegos-arcade",
    players: "2 a 4 jugadores",
    duration: "15 - 30 min",
    difficulty: "Fácil & Rápido",
    description: "¡Compite con tus amigos en pantalla gigante! Carreras frenéticas con caparazones azules, plátanos y risas aseguradas.",
    rulesSummary: "Elige tu personaje y circuito. 4 mandos inalámbricos listos para la partida.",
    tags: ["Nintendo Switch", "4 Jugadores", "Pantalla Gigante", "Torneos"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    badge: "Top Videojuegos",
    popular: true,
    featured: true,
    minPlayers: 2,
    maxPlayers: 4,
    minMinutes: 15,
  },
  {
    id: "beerpong-torneo",
    name: "Mesa Oficial de Beerpong",
    category: "beerpong-retos",
    players: "2 a 4 jugadores (1v1 o 2v2)",
    duration: "15 - 20 min",
    difficulty: "Competitivo",
    description: "El juego rey de las noches de The Corner. Encesta la pelota de ping pong en los vasos del rival y hazlos beber.",
    rulesSummary: "Lanza por turnos. Si encestas en el vaso contrario, el oponente debe tomar y retirar el vaso.",
    tags: ["Beerpong", "Rumba", "Retos"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    badge: "Rey de la Fiesta",
    popular: true,
    featured: true,
    minPlayers: 2,
    maxPlayers: 4,
    minMinutes: 15,
  },
  {
    id: "jenga-retos-corner",
    name: "Jenga con Retos Corner & Castigos",
    category: "party",
    players: "2 a 8 jugadores",
    duration: "15 - 25 min",
    difficulty: "Fácil & Rápido",
    description: "La torre de madera tradicional con un giro picante: cada bloque tiene un reto, shot o pregunta indiscreta.",
    rulesSummary: "Saca un bloque con una sola mano, lee el reto en voz alta y colócalo arriba sin que la torre caiga.",
    tags: ["Retos", "Shots", "Risas"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    badge: "Cócteles + Jenga",
    popular: true,
    featured: true,
    minPlayers: 2,
    maxPlayers: 8,
    minMinutes: 15,
  },
];

// =========================================================================
// CRONOGRAMA SEMANAL REAL
// =========================================================================
export const WEEKLY_EVENTS: WeeklyEvent[] = [
  {
    id: "miercoles-promo-baldes",
    day: "Miércoles",
    title: "Miércoles de Baldes 10$ & Narguiles",
    subtitle: "10 Cervezas x 10$ + Promo Narguile 12$",
    time: "06:00 PM - 02:00 AM",
    badge: "Promo Toda la Noche",
    description: "Arranca la semana con baldes de 10 cervezas a $10 toda la noche, sesiones de narguile y 2 perros por $5.",
    icon: "Beer",
    perk: "🍺 Balde 10 Cervezas Polar Pilsen / Light por solo 10$",
  },
  {
    id: "jueves-despecho-karaoke",
    day: "Jueves",
    title: "Noche de Despecho & Karaoke Libre",
    subtitle: "Rawayana, Morat, Lasso, Los Mesoneros y clásicos",
    time: "07:30 PM",
    badge: "Karaoke & Shots",
    description: "Canta a todo pulmón con tus amigos, karaoke en pantalla gigante, shots gratis y promo de baldes activa.",
    icon: "Mic2",
    perk: "🎤 Shots gratis para quienes canten en tarima + Baldes a 10$",
  },
  {
    id: "viernes-happy-hour-2x1",
    day: "Viernes",
    title: "Happy Hour 2x1 en Cócteles & Rumba",
    subtitle: "8:00 PM a 11:00 PM · Cócteles + Jenga = Plan Perfecto",
    time: "08:00 PM - 03:00 AM",
    badge: "Happy Hour 2x1",
    description: "2x1 en cócteles de selección (Mojitos, Cuba Libre, Daiquirís), mesas de beerpong y rumba con DJ residente.",
    icon: "Sparkles",
    perk: "🍸 2x1 en todos los cócteles de selección de 8PM a 11PM",
  },
  {
    id: "sabado-party-duelo-mesas",
    day: "Sábado",
    title: "Sábado de Rumba & Duelo de Mesas",
    subtitle: "Beerpong, Mario Kart, Narguiles y música bailable",
    time: "08:00 PM - 03:30 AM",
    badge: "Full Entertainment",
    description: "La rumba más enérgica de Costa Verde: torneos de beerpong, retos en pantalla gigante y servicio de botellas.",
    icon: "PartyPopper",
    perk: "🔥 Ronda de shots 'Power Rangers' de cortesía por botella",
  },
  {
    id: "domingo-watch-parties-burgers",
    day: "Domingo",
    title: "Domingo de Watch Parties & 3 Burgers x 15$",
    subtitle: "Partidos en vivo (Fútbol / NFL / F1) + Mario Kart y Baldes 10$",
    time: "05:00 PM - 12:00 AM",
    badge: "Watch Party & Burgers",
    description: "Transmisión de los mejores partidos en pantalla gigante, promo de 3 hamburguesas por $15 y juegos de mesa libres.",
    icon: "Trophy",
    perk: "🍔 3 Hamburguesas con papas por $15 + Baldes 10 Cervezas x 10$",
  },
];

export const INITIAL_MANAGER_KPIS: ManagerKPIs = {
  activeTables: 14,
  totalTables: 18,
  gamesInPlay: 8,
  totalGames: 24,
  todaySalesUSD: 850,
  avgTicketUSD: 35,
  pendingReservationsCount: 3,
  pendingPaymentsCount: 2,
};

export const INITIAL_LIVE_BOOKINGS: LiveBooking[] = [
  {
    id: "CRN-801",
    clientName: "Luis Ignacio Torres",
    phone: "+58 414 6321980",
    planName: "Paquete 1 (5 Personas) - Cumpleaños",
    tableNumber: "Mesa 4 (Terraza Costa Verde)",
    time: "08:00 PM",
    date: "Hoy",
    pax: 5,
    status: "en_mesa",
    totalUSD: 50,
    gameInPlay: "Jenga con Retos + Beerpong",
    notes: "¡Cumpleañero celebra con nosotros!",
    paymentMethod: "pago_movil",
    paymentReference: "849201",
    paymentBank: "Banesco",
    paymentStatus: "aprobado",
    paymentAmountVES: 3525.0,
    approvedAt: "2026-08-27 17:30",
    approvedBy: "Paul David (Gerente)",
  },
  {
    id: "CRN-802",
    clientName: "Mariana Albornoz",
    phone: "+58 424 6104432",
    planName: "Paquete 3 (15 Personas) - Mario Kart VIP",
    tableNumber: "Salón VIP Planta Alta",
    time: "08:30 PM",
    date: "Hoy",
    pax: 15,
    status: "confirmada",
    totalUSD: 85,
    notes: "Requieren Mario Kart listo a las 9:00 PM",
    paymentMethod: "zelle",
    paymentReference: "ZLL-948102",
    paymentBank: "Chase Bank",
    paymentStatus: "pendiente",
    approvedBy: undefined,
  },
  {
    id: "CRN-803",
    clientName: "Alejandro Colina",
    phone: "+58 412 5509122",
    planName: "Paquete 2 (10 Personas) - Cumpleaños",
    tableNumber: "Mesa 2",
    time: "09:00 PM",
    date: "Hoy",
    pax: 10,
    status: "pendiente",
    totalUSD: 70,
    paymentMethod: "pago_movil",
    paymentReference: "109482",
    paymentBank: "Mercantil",
    paymentStatus: "pendiente",
    paymentAmountVES: 4935.0,
  },
];
