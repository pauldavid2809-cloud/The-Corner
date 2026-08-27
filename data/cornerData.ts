/**
 * Catálogo Maestro de Datos para la WebApp de The Corner (@cornermcbo)
 * Bar de Juegos de Mesa, Pociones Mágicas, Comedia en Vivo y Eventos Privados en Maracaibo
 */

export type BoardGameCategory =
  | "todos"
  | "estrategia"
  | "party"
  | "cooperativo"
  | "rol-dnd"
  | "duelos-1v1"
  | "cartas-rapidas";

export type BoardGame = {
  id: string;
  name: string;
  category: "estrategia" | "party" | "cooperativo" | "rol-dnd" | "duelos-1v1" | "cartas-rapidas";
  players: string; // ej. "3-4", "2-8", "2"
  duration: string; // ej. "60-90 min", "15-30 min"
  difficulty: "Principiante" | "Intermedio" | "Experto";
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
  category: "pociones" | "cervezas-shots" | "munchies" | "mocktails-cafe" | "postres";
  description: string;
  priceUSD: number;
  badge?: string;
  spicy?: boolean;
  popular?: boolean;
  tags?: string[];
  image?: string;
};

export type BookingPlan = {
  id: string;
  name: string;
  badge?: string;
  description: string;
  priceUSD: number;
  unit: string;
  features: string[];
  maxCapacity?: number;
  recommendedPax?: string;
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

export type ManagerKPIs = {
  activeTables: number;
  totalTables: number;
  gamesInPlay: number;
  totalGames: number;
  todaySalesUSD: number;
  avgTicketUSD: number;
  pendingReservationsCount: number;
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
};

export const PALETTE = {
  primary: "#F97316", // Naranja neón
  primaryHover: "#EA580C",
  secondary: "#EAB308", // Amarillo dorado gamer
  accent: "#FB923C",
  magicBlue: "#38BDF8", // Azul maná
  magicPurple: "#A855F7", // Púrpura místico
  darkBg: "#0B0B0F",
  cardBg: "rgba(18, 18, 24, 0.85)",
  cardBorder: "rgba(249, 115, 22, 0.2)",
  textLight: "#FFFFFF",
  textMuted: "#94A3B8",
};

// =========================================================================
// CATÁLOGO DE 50+ JUEGOS DE MESA
// =========================================================================
export const BOARD_GAMES: BoardGame[] = [
  // --- ESTRATEGIA Y GESTIÓN ---
  {
    id: "catan",
    name: "Los Colonos de Catan",
    category: "estrategia",
    players: "3 a 4 jugadores",
    duration: "60 - 90 min",
    difficulty: "Intermedio",
    description:
      "El juego de mesa moderno más influyente de la historia. Comercia trigo, madera, ladrillo, ovejas y mineral para construir poblados, caminos y ciudades en la isla de Catan.",
    rulesSummary:
      "Tira los dados para recolectar recursos. Negocia con otros jugadores con ofertas creativas. Construye y sé el primero en acumular 10 puntos de victoria.",
    tags: ["Estrategia", "Comercio", "Negociación", "Clásico Moderno"],
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
    badge: "Top 1 Ludoteca",
    popular: true,
    featured: true,
    minPlayers: 3,
    maxPlayers: 4,
    minMinutes: 60,
  },
  {
    id: "carcassonne",
    name: "Carcassonne",
    category: "estrategia",
    players: "2 a 5 jugadores",
    duration: "35 - 45 min",
    difficulty: "Principiante",
    description:
      "Construye la campiña francesa medieval loseta a loseta: castillos fortificados, monasterios, caminos y campos desplegando tus seguidores (meeples).",
    rulesSummary:
      "Roba una loseta por turno, encájala en el mapa y coloca un meeple como caballero, monje, ladrón o granjero para puntuar.",
    tags: ["Colocación de Losetas", "Control de Área", "Familiar"],
    image: "https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&w=800&q=80",
    badge: "Fácil de Aprender",
    popular: true,
    minPlayers: 2,
    maxPlayers: 5,
    minMinutes: 35,
  },
  {
    id: "ticket-to-ride",
    name: "Ticket to Ride (Aventureros al Tren)",
    category: "estrategia",
    players: "2 a 5 jugadores",
    duration: "45 - 60 min",
    difficulty: "Principiante",
    description:
      "Conecta las principales ciudades del continente construyendo rutas de ferrocarril y cumpliendo tus billetes de destino secreto antes de que tus rivales te bloqueen.",
    rulesSummary:
      "Colecciona cartas de vagones de colores, reclama rutas en el tablero y suma puntos conectando ciudades clave.",
    tags: ["Trenes", "Colección de Sets", "Familiar", "Estratégico"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    badge: "Favorito Familiar",
    popular: true,
    minPlayers: 2,
    maxPlayers: 5,
    minMinutes: 45,
  },
  {
    id: "azul",
    name: "Azul: El Arte de los Azulejos",
    category: "estrategia",
    players: "2 a 4 jugadores",
    duration: "30 - 45 min",
    difficulty: "Principiante",
    description:
      "Inspirado en los azulejos de la Alhambra de Portugal. Reclama piezas de cerámica vidriada, planifica patrones y viste las paredes del palacio real de Évora.",
    rulesSummary:
      "Selecciona azulejos de las fábricas, prepáralos en tu cuadrícula y colócalos en la pared evitando penalizaciones de suelo.",
    tags: ["Abstracto", "Patrones", "Táctico", "Precioso"],
    image: "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=800&q=80",
    badge: "Premio Spiel des Jahres",
    popular: true,
    featured: true,
    minPlayers: 2,
    maxPlayers: 4,
    minMinutes: 30,
  },
  {
    id: "splendor",
    name: "Splendor: El Renacimiento",
    category: "estrategia",
    players: "2 a 4 jugadores",
    duration: "30 min",
    difficulty: "Principiante",
    description:
      "Conviértete en un influyente mercader del Renacimiento comprando minas de gemas, transporte y artesanos para atraer la visita de nobles ilustres.",
    rulesSummary:
      "Toma fichas de gemas (fichas pesadas de póker), compra cartas de desarrollo que abaratan futuras compras y alcanza 15 puntos.",
    tags: ["Motor de Recursos", "Gemas", "Rápido", "Adictivo"],
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
    popular: true,
    minPlayers: 2,
    maxPlayers: 4,
    minMinutes: 30,
  },
  {
    id: "7-wonders",
    name: "7 Wonders (Segunda Edición)",
    category: "estrategia",
    players: "3 a 7 jugadores",
    duration: "30 - 40 min",
    difficulty: "Intermedio",
    description:
      "Lidera una de las 7 grandes civilizaciones del mundo antiguo. Desarrolla tu ejército, ciencia, comercio y erige tu maravilla arquitectónica a lo largo de 3 eras.",
    rulesSummary:
      "Drafting simultáneo de cartas: escoge una carta de tu mano y pasa el resto a tu vecino. Cero tiempo de espera entre turnos.",
    tags: ["Drafting", "Civilizaciones", "Hasta 7 Jugadores", "Simultáneo"],
    image: "https://images.unsplash.com/photo-1544654803-b69140b285a1?auto=format&fit=crop&w=800&q=80",
    badge: "Ideal Grupos Grandes",
    minPlayers: 3,
    maxPlayers: 7,
    minMinutes: 30,
  },
  {
    id: "terraforming-mars",
    name: "Terraforming Mars",
    category: "estrategia",
    players: "1 a 5 jugadores",
    duration: "90 - 120 min",
    difficulty: "Experto",
    description:
      "Grandes corporaciones compiten por transformar el Planeta Rojo en un hábitat habitable elevando la temperatura, el oxígeno y cubriendo los océanos.",
    rulesSummary:
      "Gestiona megacréditos, calor y recursos energéticos para jugar patentes científicas y construir ciudades y bosques en Marte.",
    tags: ["Ciencia Ficción", "Experto", "Motor de Cartas", "Épico"],
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    badge: "Hardcore Gamer",
    minPlayers: 1,
    maxPlayers: 5,
    minMinutes: 90,
  },
  {
    id: "scythe",
    name: "Scythe: Europa 1920+",
    category: "estrategia",
    players: "1 a 5 jugadores",
    duration: "90 - 115 min",
    difficulty: "Experto",
    description:
      "Un universo distópico de Europa de los años 20 con mechs a vapor, agricultura y expansión territorial tras la Gran Guerra.",
    rulesSummary:
      "Mueve trabajadores, despliega mechs gigantescos, conquista La Fábrica central y gestiona tu popularidad y poder militar.",
    tags: ["Steampunk", "Control de Territorio", "Miniaturas Mechs", "Experto"],
    image: "https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&w=800&q=80",
    badge: "Obra Maestra",
    minPlayers: 1,
    maxPlayers: 5,
    minMinutes: 90,
  },
  {
    id: "wingspan",
    name: "Wingspan: Aves del Mundo",
    category: "estrategia",
    players: "1 a 5 jugadores",
    duration: "40 - 70 min",
    difficulty: "Intermedio",
    description:
      "Eres un apasionado de las aves: investigadores, observadores y ornitólogos que buscan descubrir y atraer a las mejores aves a su reserva natural.",
    rulesSummary:
      "Tira dados de alimento en la caseta comedero, pon huevos miniatura de colores y encadena combos con más de 170 cartas ilustradas.",
    tags: ["Naturaleza", "Construcción de Motores", "Diseño Increíble"],
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80",
    badge: "Top Calificación",
    minPlayers: 1,
    maxPlayers: 5,
    minMinutes: 40,
  },
  {
    id: "cascadia",
    name: "Cascadia: Hábitats del Noroeste",
    category: "estrategia",
    players: "1 a 4 jugadores",
    duration: "30 - 45 min",
    difficulty: "Principiante",
    description:
      "Crea el ecosistema más armonioso del Noroeste del Pacífico uniendo hábitats naturales (ríos, montañas, praderas) y poblándolos con fauna salvaje.",
    rulesSummary:
      "Draftea parejas de loseta de hábitat y ficha de animal (osos, alces, salmones, halcones) cumpliendo patrones de fauna.",
    tags: ["Naturaleza", "Patrones", "Relajante", "Juego del Año"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    minPlayers: 1,
    maxPlayers: 4,
    minMinutes: 30,
  },

  // --- PARTY GAMES & DIVERSIÓN EN GRUPO ---
  {
    id: "codenames",
    name: "Codenames (Código Secreto)",
    category: "party",
    players: "4 a 10+ jugadores",
    duration: "15 - 20 min",
    difficulty: "Principiante",
    description:
      "Dos espías rivales conocen la identidad secreta de 25 agentes. Sus compañeros de equipo deben descifrar pistas de una sola palabra para contactar a sus agentes sin tocar al asesino.",
    rulesSummary:
      "El jefe de espías da una pista compuesta por: '1 sola palabra + 1 número' (ej. 'Fruta 2'). Su equipo señala palabras intentando no equivocarse.",
    tags: ["Palabras", "Deducción", "Equipos", "Cero Espera", "Party Top"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    badge: "El Rey de las Fiestas",
    popular: true,
    featured: true,
    minPlayers: 4,
    maxPlayers: 10,
    minMinutes: 15,
  },
  {
    id: "dixit",
    name: "Dixit: Odisea de la Imaginación",
    category: "party",
    players: "3 a 8 jugadores",
    duration: "30 min",
    difficulty: "Principiante",
    description:
      "Un fascinante juego de cartas poéticas y surrealistas. El narrador dice una frase, canción o sonido y los demás eligen una carta de su mano que mejor encaje.",
    rulesSummary:
      "Adivina la carta secreta del narrador. Si todos o ninguno aciertan, el narrador pierde puntos: la clave es ser sutil pero no obvio.",
    tags: ["Imaginación", "Arte Surrealista", "Creatividad", "Amigos"],
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    badge: "Visualmente Mágico",
    popular: true,
    minPlayers: 3,
    maxPlayers: 8,
    minMinutes: 30,
  },
  {
    id: "exploding-kittens",
    name: "Exploding Kittens: Edición NSFW / Party",
    category: "party",
    players: "2 a 5 jugadores",
    duration: "15 min",
    difficulty: "Principiante",
    description:
      "Una versión gatuna y potenciada de la ruleta rusa. Robas cartas hasta que alguien saca un Gatito Explosivo y vuela en pedazos a menos que use un puntero láser o sándwich de hierba gatera.",
    rulesSummary:
      "Juega cartas de ataque, mira el futuro, salta turnos o desactiva la bomba para forzar a tus amigos a explotar antes que tú.",
    tags: ["Humor Absurdo", "Rápido", "Traición", "Gatitos"],
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
    badge: "Risas Garantizadas",
    popular: true,
    minPlayers: 2,
    maxPlayers: 5,
    minMinutes: 15,
  },
  {
    id: "secret-hitler",
    name: "Secret Hitler",
    category: "party",
    players: "5 a 10 jugadores",
    duration: "45 min",
    difficulty: "Intermedio",
    description:
      "Un dramático juego de deducción política y engaño en la Alemania de los años 30. Los jugadores se dividen en liberales y fascistas que ocultan su identidad.",
    rulesSummary:
      "Elige presidente y canciller, promulga leyes y descubre quién está mintiendo descaradamente antes de que los fascistas tomen el control.",
    tags: ["Roles Ocultos", "Engaño", "Intriga", "Discusión Intensa"],
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    badge: "Top Roles Ocultos",
    popular: true,
    minPlayers: 5,
    maxPlayers: 10,
    minMinutes: 45,
  },
  {
    id: "taco-gato-cabra-queso-pizza",
    name: "Taco Gato Cabra Queso Pizza",
    category: "party",
    players: "3 a 8 jugadores",
    duration: "10 min",
    difficulty: "Principiante",
    description:
      "¡Acción pura de reflejos y bofetadas a la mesa! Di las palabras mágicas en orden mientras bajas cartas. Si la palabra coincide con la carta, ¡sé el primero en poner la mano!",
    rulesSummary:
      "Mantén el ritmo: Taco, Gato, Cabra, Queso, Pizza. Cuidado con el Gorila, Marmota y Narval que exigen gestos locos antes de golpear.",
    tags: ["Reflejos", "Bofetadas", "Caos Rápido", "Ideal con Tragos"],
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    badge: "Locura Máxima",
    popular: true,
    minPlayers: 3,
    maxPlayers: 8,
    minMinutes: 10,
  },
  {
    id: "avalon",
    name: "The Resistance: Avalon",
    category: "party",
    players: "5 a 10 jugadores",
    duration: "30 min",
    difficulty: "Intermedio",
    description:
      "Leales caballeros del Rey Arturo se enfrentan a los esbirros de Mordred. Merlín conoce a los traidores, pero si el Asesino lo descubre al final, el mal triunfa.",
    rulesSummary:
      "Vota en equipo para enviar grupos a misiones sagradas y descubre los votos de sabotaje secretos.",
    tags: ["Fantasía", "Deducción Social", "Sin Eliminación", "Clásico"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    minPlayers: 5,
    maxPlayers: 10,
    minMinutes: 30,
  },
  {
    id: "just-one",
    name: "Just One (¡Solo Uno!)",
    category: "party",
    players: "3 a 7 jugadores",
    duration: "20 min",
    difficulty: "Principiante",
    description:
      "Juego cooperativo de fiesta. Uno de los jugadores cierra los ojos mientras los demás escriben en sus atriles una palabra pista. ¡Si dos pistas se repiten, quedan canceladas!",
    rulesSummary:
      "Piensa pistas originales pero no imposibles. Ayuda al adivinador a lograr la puntuación perfecta de 13 palabras.",
    tags: ["Cooperativo", "Palabras", "Premio Spiel des Jahres", "Risas"],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    minPlayers: 3,
    maxPlayers: 7,
    minMinutes: 20,
  },
  {
    id: "telestrations",
    name: "Telestrations (El Teléfono Descompuesto Dibujado)",
    category: "party",
    players: "4 a 8 jugadores",
    duration: "20 - 30 min",
    difficulty: "Principiante",
    description:
      "¡No necesitas saber dibujar para llorar de risa! Dibuja una palabra secreta, pasa el cuaderno, el siguiente adivina qué es, y el siguiente dibuja la adivinanza.",
    rulesSummary:
      "Mira cómo una simple 'Hamburguesa' se transforma en un 'Alien montando en bicicleta' al final de la ronda.",
    tags: ["Dibujo", "Risas Absurdas", "Party", "Todos a la vez"],
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    popular: true,
    minPlayers: 4,
    maxPlayers: 8,
    minMinutes: 20,
  },

  // --- COOPERATIVOS & ESCAPE ---
  {
    id: "pandemic",
    name: "Pandemic: Salva el Planeta",
    category: "cooperativo",
    players: "2 a 4 jugadores",
    duration: "45 min",
    difficulty: "Intermedio",
    description:
      "Sois un equipo de especialistas del CDC (Médico, Científico, Investigador) luchando juntos para contener 4 epidemias globales antes de que acaben con la humanidad.",
    rulesSummary:
      "Combina las habilidades únicas de tus personajes, comparte cartas en ciudades clave y descubre las 4 curas.",
    tags: ["Cooperativo", "Tensión", "Estrategia de Equipo", "Clásico"],
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=800&q=80",
    badge: "Top Cooperativo",
    popular: true,
    featured: true,
    minPlayers: 2,
    maxPlayers: 4,
    minMinutes: 45,
  },
  {
    id: "the-crew",
    name: "The Crew: Misión al Planeta Nueve",
    category: "cooperativo",
    players: "3 a 5 jugadores",
    duration: "20 min",
    difficulty: "Intermedio",
    description:
      "Juego cooperativo de bazas en el espacio exterior. Cumple más de 50 misiones con comunicación limitada en gravedad cero.",
    rulesSummary:
      "Gana las bazas correctas con las cartas exactas sin hablar directamente de tu mano.",
    tags: ["Bazas", "Ciencia Ficción", "Cooperativo", "Desafiante"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    minPlayers: 3,
    maxPlayers: 5,
    minMinutes: 20,
  },
  {
    id: "forbidden-island",
    name: "La Isla Prohibida",
    category: "cooperativo",
    players: "2 a 4 jugadores",
    duration: "30 min",
    difficulty: "Principiante",
    description:
      "Únete a un grupo de intrépidos aventureros en una misión para recuperar cuatro tesoros sagrados de las ruinas de una isla que se hunde minuto a minuto.",
    rulesSummary:
      "Apuntala losetas anegadas, intercambia tesoros y corre al helipuerto antes de que las aguas cubran el mapa.",
    tags: ["Aventura", "Escape", "Familiar", "Rápido"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    minPlayers: 2,
    maxPlayers: 4,
    minMinutes: 30,
  },
  {
    id: "horrified",
    name: "Horrified: Monstruos Clásicos de Universal",
    category: "cooperativo",
    players: "1 a 5 jugadores",
    duration: "60 min",
    difficulty: "Intermedio",
    description:
      "Defiende el pueblo cooperando contra Drácula, la Momia, Frankenstein, el Hombre Lobo y el Monstruo de la Laguna Negra.",
    rulesSummary:
      "Cada monstruo tiene un minijuego único para ser derrotado. Rescata aldeanos y recolecta objetos mágicos.",
    tags: ["Terror Retro", "Cooperativo", "Miniaturas", "Inmersivo"],
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80",
    badge: "Tema Espectacular",
    minPlayers: 1,
    maxPlayers: 5,
    minMinutes: 60,
  },

  // --- ROL, FANTASÍA & D&D ---
  {
    id: "dnd-starter",
    name: "Dungeons & Dragons 5e: Caja de Inicio",
    category: "rol-dnd",
    players: "3 a 6 jugadores",
    duration: "90 - 180 min",
    difficulty: "Intermedio",
    description:
      "El juego de rol más legendario de la historia. Vive aventuras guiadas por nuestros Game Masters de The Corner con hojas de personaje listas, dados poliédricos (D20, D12, D6) y miniaturas.",
    rulesSummary:
      "Declara qué hace tu personaje (Guerrero, Mago, Pícaro, Clérigo), tira el D20 y deja que el Dungeon Master teja la historia.",
    tags: ["Juego de Rol", "D&D 5e", "Fantasía Épica", "Game Master en Mesa"],
    image: "https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&w=800&q=80",
    badge: "Experiencia Estrella",
    popular: true,
    featured: true,
    minPlayers: 3,
    maxPlayers: 6,
    minMinutes: 90,
  },
  {
    id: "munchkin-deluxe",
    name: "Munchkin Deluxe",
    category: "rol-dnd",
    players: "3 a 6 jugadores",
    duration: "60 min",
    difficulty: "Principiante",
    description:
      "Mata al monstruo, roba el tesoro y apuñala a tus amigos por la espalda. Una parodia salvaje y divertidísima de los juegos de rol clásicos.",
    rulesSummary:
      "Patea la puerta de la mazmorra, equipa la 'Sierra para partir piernas' o el 'Casco de Cuernos' y alcanza el Nivel 10.",
    tags: ["Parodia RPG", "Traición", "Tesoros", "Cartas Locas"],
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
    badge: "Apuñala a tus Amigos",
    popular: true,
    minPlayers: 3,
    maxPlayers: 6,
    minMinutes: 60,
  },
  {
    id: "betrayal-house-hill",
    name: "Betrayal at House on the Hill (3ra Ed.)",
    category: "rol-dnd",
    players: "3 a 6 jugadores",
    duration: "60 - 90 min",
    difficulty: "Intermedio",
    description:
      "Explorad juntos una mansión embrujada habitación por habitación... hasta que ocurre 'El Trance' y uno de los jugadores se convierte en un traidor monstruoso con uno de 50 escenarios de terror.",
    rulesSummary:
      "Fase 1: Exploran juntos. Fase 2: Se revela el traidor (vampiros, fantasmas, zombies) y arranca la batalla de supervivencia.",
    tags: ["Terror Cinematográfico", "Mansión", "50 Escenarios", "Inmersivo"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    minPlayers: 3,
    maxPlayers: 6,
    minMinutes: 60,
  },
  {
    id: "gloomhaven-jaws",
    name: "Gloomhaven: Fauces del León",
    category: "rol-dnd",
    players: "1 a 4 jugadores",
    duration: "60 - 120 min",
    difficulty: "Experto",
    description:
      "Tácticas cooperativas de mazmorreo profundo. Lidera a un grupo de mercenarios veteranos en la peligrosa ciudad de Gloomhaven con combate táctico por cartas sin dados.",
    rulesSummary:
      "Juega cartas dobles (arriba acción / abajo movimiento) y combina ataques elementales en mapas de campaña interactivos.",
    tags: ["Mazmorras", "Táctico", "Campaña RPG", "Experto"],
    image: "https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&w=800&q=80",
    badge: "Top 1 BoardGameGeek RPG",
    minPlayers: 1,
    maxPlayers: 4,
    minMinutes: 60,
  },

  // --- DUELOS 1v1 & TÁCTICOS ---
  {
    id: "7-wonders-duel",
    name: "7 Wonders Duel",
    category: "duelos-1v1",
    players: "2 jugadores",
    duration: "30 min",
    difficulty: "Intermedio",
    description:
      "Considerado unánimemente uno de los mejores juegos de mesa para 2 jugadores de la historia. Lucha por supremacía militar, científica o civil.",
    rulesSummary:
      "Elige cartas de una estructura piramidal visible y oculta, erige tus maravillas y acorrala a tu rival.",
    tags: ["Duelo 1v1", "Estrategia Pura", "Top 2 Jugadores"],
    image: "https://images.unsplash.com/photo-1544654803-b69140b285a1?auto=format&fit=crop&w=800&q=80",
    badge: "Mejor Juego para Parejas",
    popular: true,
    featured: true,
    minPlayers: 2,
    maxPlayers: 2,
    minMinutes: 30,
  },
  {
    id: "radlands",
    name: "Radlands: Duelo Postapocalíptico",
    category: "duelos-1v1",
    players: "2 jugadores",
    duration: "20 - 30 min",
    difficulty: "Intermedio",
    description:
      "Duelo de cartas cyberpunk/Mad Max con arte flúor neón increíble. Protege tus 3 campamentos y gestiona tu agua potable para destruir a tu oponente.",
    rulesSummary:
      "Usa fichas de agua para desplegar punks, lanzar rayos láser o enviar francotiradores mutantes.",
    tags: ["Cyberpunk Flúor", "Duelo", "Gestión de Agua", "Visual 10/10"],
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    badge: "Estética Flúor Neón",
    popular: true,
    minPlayers: 2,
    maxPlayers: 2,
    minMinutes: 20,
  },
  {
    id: "hive-pocket",
    name: "Hive Pocket (La Colmena)",
    category: "duelos-1v1",
    players: "2 jugadores",
    duration: "20 min",
    difficulty: "Principiante",
    description:
      "El ajedrez moderno de insectos sin tablero. Rodea por completo a la Abeja Reina de tu rival con hormigas veloces, escarabajos trepadores y saltamontes.",
    rulesSummary:
      "Coloca y mueve piezas hexagonales de baquelita sólida sin romper la colmena compartida.",
    tags: ["Ajedrez Moderno", "Sin Tablero", "Táctico", "Rápido"],
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=800&q=80",
    minPlayers: 2,
    maxPlayers: 2,
    minMinutes: 20,
  },
  {
    id: "unmatched-legends",
    name: "Unmatched: Batalla de Leyendas",
    category: "duelos-1v1",
    players: "2 a 4 jugadores",
    duration: "30 min",
    difficulty: "Principiante",
    description:
      "¿Quién ganaría en una pelea entre Medusa, el Rey Arturo, Simbad y Alicia en el País de las Maravillas? Combate táctico con miniaturas y barajas temáticas asimétricas.",
    rulesSummary:
      "Maniobra en el mapa y juega cartas de ataque y defensa con efectos espectaculares.",
    tags: ["Lucha Táctica", "Miniaturas", "Asimétrico", "Súper Dinámico"],
    image: "https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&w=800&q=80",
    badge: "Duelos Épicos",
    minPlayers: 2,
    maxPlayers: 4,
    minMinutes: 30,
  },
  {
    id: "jaipur",
    name: "Jaipur: El Mercado del Maharajá",
    category: "duelos-1v1",
    players: "2 jugadores",
    duration: "25 min",
    difficulty: "Principiante",
    description:
      "Compite en el mercado indio comerciando telas, especias, oro, diamantes y una valiosa manada de camellos para ganarte el favor del Maharajá.",
    rulesSummary:
      "Compra o vende lotes de mercancías antes que tu rival para llevarte las fichas de mayor bonificación.",
    tags: ["Mercado", "Cartas y Fichas", "Elegante", "Rápido"],
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
    minPlayers: 2,
    maxPlayers: 2,
    minMinutes: 25,
  },

  // --- CARTAS RÁPIDAS & DESTEZA ---
  {
    id: "sushi-go",
    name: "Sushi Go! Fiesta",
    category: "cartas-rapidas",
    players: "2 a 8 jugadores",
    duration: "20 min",
    difficulty: "Principiante",
    description:
      "¡El festín de sushi más tierno y rápido! Atrapa los mejores bocados de maki, nigiri con wasabi, sashimi y postres mientras las cartas dan vueltas en la mesa.",
    rulesSummary:
      "Escoge una carta, pásala a tu vecino y colecciona combinaciones para sumar la mayor puntuación en 3 rondas.",
    tags: ["Drafting Rápido", "Comida", "Fácil", "Hasta 8 Jugadores"],
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    popular: true,
    minPlayers: 2,
    maxPlayers: 8,
    minMinutes: 20,
  },
  {
    id: "uno-flip",
    name: "UNO Flip! Gamer Edition",
    category: "cartas-rapidas",
    players: "2 a 10 jugadores",
    duration: "15 min",
    difficulty: "Principiante",
    description:
      "El UNO clásico con cartas de doble cara: Lado Claro (amigable) y Lado Oscuro (castigos despiadados de +5 cartas, saltar a todos y bloqueos).",
    rulesSummary:
      "Cuando se juega la carta 'FLIP', toda la baraja y las manos de los jugadores se dan vuelta al lado oscuro.",
    tags: ["UNO", "Lado Oscuro", "Party", "Venganza"],
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
    minPlayers: 2,
    maxPlayers: 10,
    minMinutes: 15,
  },
  {
    id: "jenga-gamer",
    name: "Jenga Gigante con Retos Corner",
    category: "cartas-rapidas",
    players: "2 a 8 jugadores",
    duration: "15 min",
    difficulty: "Principiante",
    description:
      "La clásica torre de bloques de madera con una regla especial: cada bloque sacado tiene un reto, pregunta picante o shot de cortesía para el grupo.",
    rulesSummary:
      "Saca un bloque con una sola mano, colócalo arriba y cumple el reto sin derribar la torre.",
    tags: ["Destreza", "Tragos", "Tensión", "Risas"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    badge: "Retos de la Casa",
    popular: true,
    minPlayers: 2,
    maxPlayers: 8,
    minMinutes: 15,
  },
  {
    id: "dobble",
    name: "Dobble (Spot It!)",
    category: "cartas-rapidas",
    players: "2 a 8 jugadores",
    duration: "10 min",
    difficulty: "Principiante",
    description:
      "¡Siempre hay un único símbolo idéntico entre dos cartas cualesquiera! Encuéntralo y nómbralo antes que nadie para ganar la carta.",
    rulesSummary:
      "Velocidad visual y reflejos instantáneos en 5 divertidos minijuegos.",
    tags: ["Reflejos", "Velocidad Visual", "Ultrarrápido", "Familiar"],
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
    minPlayers: 2,
    maxPlayers: 8,
    minMinutes: 10,
  },
];

// =========================================================================
// CARTA DE TRAGOS, POCIONES & MUNCHIES
// =========================================================================
export const MENU_ITEMS: MenuItem[] = [
  // --- POCIONES DE AUTOR & TRAGOS MÁGICOS ---
  {
    id: "pocion-mana-blue",
    name: "Poción Maná Azul (Signature UV)",
    category: "pociones",
    description:
      "Ginebra premium, licor de moras azules silvestres, cordial de lima ácida, tónica y glitter comestible que brilla intensamente bajo luz ultravioleta.",
    priceUSD: 7.5,
    badge: "Brilla en la Oscuridad",
    popular: true,
    tags: ["Glitter Comestible", "Luz UV", "Ginebra", "Top 1"],
  },
  {
    id: "pocion-vida-roja",
    name: "Poción de Curación HP (+100 Vida)",
    category: "pociones",
    description:
      "Vodka infusionado en fresas maduras, licor de flor de saúco, reducción de frutos rojos, soda efervescente y perlas explosivas de granada.",
    priceUSD: 7.0,
    badge: "Restaura Vida",
    popular: true,
    tags: ["Dulce y Cítrico", "Vodka", "Perlas Pop"],
  },
  {
    id: "dragon-breath-flame",
    name: "Aliento de Dragón (Flameado)",
    category: "pociones",
    description:
      "Ron añejo especiado venezolano, licor de naranja amarga, maracuyá concentrado, sirope de canela y lluvia de canela en polvo encendida al servir en la mesa.",
    priceUSD: 8.5,
    badge: "Show con Fuego",
    spicy: true,
    popular: true,
    tags: ["Flameado en Mesa", "Ron Especiado", "Espectacular"],
  },
  {
    id: "elixir-invisibilidad",
    name: "Elixir de la Invisibilidad",
    category: "pociones",
    description:
      "Tequila blanco 100% agave, licor de pepino y albahaca, jugo de limón eureka, humo aromático encapsulado en burbuja mágica sobre la copa.",
    priceUSD: 8.0,
    badge: "Burbuja de Humo",
    tags: ["Tequila", "Burbuja Mágica", "Fresco"],
  },
  {
    id: "101-corner-mule",
    name: "101 Corner Mule Gamer",
    category: "pociones",
    description:
      "Vodka artesanal, cerveza de jengibre picante (Ginger Beer), lima macerada al momento y jarabe de romero fresco servido en jarro de cobre helado.",
    priceUSD: 6.5,
    tags: ["Jarro de Cobre", "Jengibre", "Refrescante"],
  },
  {
    id: "fairy-dust-gin",
    name: "Polvo de Hadas Floral Tonic",
    category: "pociones",
    description:
      "Ginebra rosa con infusión de lavanda y pétalos de rosa, jarabe de hibisco y agua tónica botánica que cambia de color al mezclarse.",
    priceUSD: 7.5,
    tags: ["Cambia de Color", "Floral", "Ginebra Rosa"],
  },

  // --- CERVEZAS, BALDES & SHOTS ---
  {
    id: "balde-polar-6",
    name: "Balde Gamer: 6 Polar Pilsen / Light",
    category: "cervezas-shots",
    description:
      "Balde metálico lleno de hielo con 6 botellitas bien vestidas de novia para la mesa.",
    priceUSD: 9.0,
    badge: "Combo Rápido",
    popular: true,
    tags: ["Cerveza Nacional", "Balde Helado", "6 Unidades"],
  },
  {
    id: "balde-corona-extra-6",
    name: "Balde Premium: 6 Corona Extra con Limas",
    category: "cervezas-shots",
    description:
      "6 botellas de Corona Extra servidas en cubeta de hielo con rodajas de limón y sal marina.",
    priceUSD: 14.0,
    tags: ["Cerveza Importada", "Corona", "Limas"],
  },
  {
    id: "ronda-5-shots-d20",
    name: "Ronda Crítica D20: 5 Shots de Tequila",
    category: "cervezas-shots",
    description:
      "5 shots de tequila blanco servidos en bandeja temática de dados de rol con sal de gusano y gajos de naranja.",
    priceUSD: 12.0,
    badge: "Tira el D20",
    popular: true,
    tags: ["Shots", "Tequila", "Para Grupos"],
  },
  {
    id: "michelada-corner-especial",
    name: "Michelada Corner Clamato & Tajín",
    category: "cervezas-shots",
    description:
      "Vaso escarchado con salsa de chamoy casera, tajín mexicano, mezcla de salsas oscuras, clamato y cerveza bien fría a elección.",
    priceUSD: 4.5,
    spicy: true,
    tags: ["Chamoy", "Tajín", "Picante Suave"],
  },

  // --- MUNCHIES, BURGERS & TABLAS DE LA MAZMORRA ---
  {
    id: "nachos-volcanicos-corner",
    name: "Nachos Volcánicos de la Mazmorra",
    category: "munchies",
    description:
      "Montaña de totopos crujientes bañados en doble queso cheddar fundido, carne de res sazonada, frijoles negros, pico de gallo fresco, jalapeños y guacamole de la casa.",
    priceUSD: 11.5,
    badge: "Plato Más Pedido",
    popular: true,
    tags: ["Para Compartir", "Queso Cheddar", "Guacamole"],
  },
  {
    id: "smash-burger-dragon",
    name: "Smash Burger Dragón Doble Angus",
    category: "munchies",
    description:
      "Doble carne Angus smash (160g), queso cheddar madurado derretido, tocineta ahumada crujiente, cebolla caramelizada y salsa secreta Corner en pan brioche artesanal con papas fritas.",
    priceUSD: 10.5,
    popular: true,
    tags: ["Carne Angus", "Pan Brioche", "Papas Fritas"],
  },
  {
    id: "tequenos-gamer-truffle",
    name: "Tequeños Gigantes Gamer (6 Unidades)",
    category: "munchies",
    description:
      "6 tequeños extra grandes rellenos con abundante queso de mano fundente, servidos con dip de salsa tártara de trufa negra y mermelada de pimentón.",
    priceUSD: 8.0,
    badge: "Infaltables",
    popular: true,
    tags: ["Queso de Mano", "Salsa Trufa", "Piqueo"],
  },
  {
    id: "cesta-12-alitas-bbq-habanero",
    name: "Cesta de 12 Alitas BBQ Ahumada o Búfalo",
    category: "munchies",
    description:
      "Alitas de pollo extra crujientes glaseadas en salsa BBQ ahumada al bourbon o salsa búfalo picante, servidas con bastones de apio y aderezo ranch.",
    priceUSD: 13.0,
    spicy: true,
    tags: ["Alitas", "BBQ Ahumada", "Ranch"],
  },
  {
    id: "papas-bravas-mazmorra",
    name: "Papas Rústicas de la Mazmorra",
    category: "munchies",
    description:
      "Papas fritas con piel crujientes por fuera y suaves por dentro, bañadas en salsa brava casera, queso parmesano rallado y tocineta picada.",
    priceUSD: 6.5,
    tags: ["Papas Fritas", "Parmesano", "Bacon"],
  },

  // --- MOCKTAILS & CAFETERÍA SIN ALCOHOL ---
  {
    id: "pocion-revivir-mocktail",
    name: "Poción de Revivir (Mocktail Sin Alcohol)",
    category: "mocktails-cafe",
    description:
      "Puré natural de maracuyá y frutos rojos, hierbabuena fresca, jugo de naranja y soda tónica con escarcha azucarada de colores.",
    priceUSD: 4.5,
    badge: "0% Alcohol",
    tags: ["Sin Alcohol", "Frutos Rojos", "Refrescante"],
  },
  {
    id: "cold-brew-nitro-caramel",
    name: "Cold Brew Nitro Vainilla & Caramelo",
    category: "mocktails-cafe",
    description:
      "Café de especialidad venezolano extraído en frío por 18 horas, leche vaporizada y sirope de caramelo salado.",
    priceUSD: 4.0,
    tags: ["Café de Especialidad", "Energía Gamer"],
  },
  {
    id: "frappe-lotus-gamer",
    name: "Frappé Lotus Biscoff con Crema Chantilly",
    category: "mocktails-cafe",
    description:
      "Frappé cremoso de galleta Lotus Biscoff, helado de vainilla, sirope de canela y trozos de galleta crujiente.",
    priceUSD: 5.5,
    tags: ["Lotus Biscoff", "Frappé", "Dulce"],
  },

  // --- POSTRES & DULCES ---
  {
    id: "volcan-chocolate-corner",
    name: "Volcán de Lava de Chocolate con Helado",
    category: "postres",
    description:
      "Bizcocho tibio de chocolate oscuro con centro líquido derretido, bola de helado de mantecado artesanal y lluvia de crumble de galleta.",
    priceUSD: 6.0,
    badge: "Delicioso",
    tags: ["Chocolate Líquido", "Helado", "Postre"],
  },
];

// =========================================================================
// PLANES Y MODALIDADES DE RESERVA
// =========================================================================
export const BOOKING_PLANS: BookingPlan[] = [
  {
    id: "mesa-gamer-ludoteca",
    name: "Mesa Gamer con Ludoteca Ilimitada (2 a 6 Pax)",
    badge: "Más Solicitada",
    description:
      "Acceso ilimitado a todo el catálogo de más de 50 juegos de mesa, mesa amplia con portavasos gamer y explicación de reglas por nuestros Game Masters.",
    priceUSD: 10,
    unit: "abono por mesa / grupo",
    recommendedPax: "2 a 6 personas",
    maxCapacity: 6,
    features: [
      "Acceso ilimitado a más de 50 juegos de mesa",
      "Asesoría y explicación de reglas por Game Masters dedicados",
      "Mesa amplia con portavasos integrados",
      "Sin límite de tiempo durante tu estancia",
      "100% abonable a tu consumo de tragos y comida",
    ],
  },
  {
    id: "salon-vip-mazmorra",
    name: "Salón VIP Mazmorra / Eventos Privados & Cumpleaños",
    badge: "Exclusivo Grupos",
    description:
      "Espacio privado reservado para hasta 15 personas con decoración gamer, Game Master 100% exclusivo para tu grupo y combos de comida incluidos.",
    priceUSD: 70,
    unit: "paquete completo",
    recommendedPax: "Hasta 15 personas",
    maxCapacity: 15,
    features: [
      "Salón privado reservado con aire acondicionado de alta capacidad",
      "Game Master 100% dedicado a guiar partidas y torneos en tu grupo",
      "2 Rondas de Tequeños gigantes (12 tequeños)",
      "1 Jarra de Poción Mágica de la casa de bienvenida",
      "Descuento especial del 10% en botellas y carta de tragos",
      "Pase digital VIP con validación QR para todos los invitados",
    ],
  },
  {
    id: "noche-comedia-standup",
    name: "Mesa Noche de Stand-Up Comedy & Shows en Vivo",
    badge: "Miércoles de Comedia",
    description:
      "Mesa preferencial con vista frontal al escenario para las noches de comedia en vivo y open mic con comediantes de la ciudad.",
    priceUSD: 15,
    unit: "abono por mesa (2 a 4 pax)",
    recommendedPax: "2 a 4 personas",
    maxCapacity: 4,
    features: [
      "Mesa en primera fila o zona central frente al escenario",
      "Acceso garantizado al show de comedia sin hacer fila",
      "100% abonable al consumo de bebidas y platos",
      "Promoción especial de 2x1 en cócteles seleccionados durante el show",
    ],
  },
  {
    id: "mesa-barra-drinks",
    name: "Mesa Lounge Barra & Drinks After-Work",
    description:
      "Mesa alta o sofá lounge cerca de la barra para picar algo rico, probar pociones de autor y disfrutar de buena música.",
    priceUSD: 10,
    unit: "abono por mesa",
    recommendedPax: "2 a 4 personas",
    maxCapacity: 4,
    features: [
      "Ubicación preferencial en zona de barra / lounge",
      "Servicio express de coctelería y snacks",
      "100% abonable a la cuenta final",
      "Acceso libre a juegos rápidos de cartas en mesa",
    ],
  },
];

// =========================================================================
// AGENDA SEMANAL DE EVENTOS & TORNEOS
// =========================================================================
export const WEEKLY_EVENTS: WeeklyEvent[] = [
  {
    id: "miercoles-comedia",
    day: "Miércoles",
    title: "Noche de Stand-Up Comedy & Open Mic",
    subtitle: "Risas, monólogos en vivo y comediantes invitados",
    time: "08:00 PM",
    badge: "Comedia en Vivo",
    description:
      "Ven a desconectar la semana con los mejores comediantes de stand-up de Maracaibo en un ambiente íntimo y desenfadado.",
    icon: "Mic2",
    perk: "🔥 Promo: 2x1 en Pociones seleccionadas durante el show",
  },
  {
    id: "jueves-torneo-catan",
    day: "Jueves",
    title: "Torneo Semanal de Catan & Codenames",
    subtitle: "Compite por premios en botellas y gloria gamer",
    time: "07:30 PM",
    badge: "Torneo Oficial",
    description:
      "Pon a prueba tus dotes de estratega y negociador en nuestras mesas competitivas con jueces y ranking en vivo.",
    icon: "Trophy",
    perk: "🏆 Premios: Botella de licor premium + Pase de ludoteca gratis por 1 mes",
  },
  {
    id: "viernes-glow-uv",
    day: "Viernes",
    title: "Glow & Pociones UV Party",
    subtitle: "Tragos fluorescentes, luces negras y DJ set nocturno",
    time: "08:30 PM",
    badge: "Noche Neón",
    description:
      "El local se transforma bajo luz ultravioleta: pociones con glitter mágico brillante, maquillaje neón de cortesía y música vibrante.",
    icon: "Sparkles",
    perk: "✨ Glitter bar gratis para todos los asistentes",
  },
  {
    id: "sabado-party-games",
    day: "Sábado",
    title: "Party Games Extremos & Duelo de Mesas",
    subtitle: "Exploding Kittens, Taco Gato, Telestrations y retos",
    time: "07:00 PM",
    badge: "Party Time",
    description:
      "Mesas gigantescas con juegos de fiesta de alta energía, castigos divertidos con shots y la mejor vibra para celebrar con amigos.",
    icon: "PartyPopper",
    perk: "🎉 Shot de cortesía para la mesa ganadora de cada ronda",
  },
  {
    id: "domingo-dnd-roleplay",
    day: "Domingo",
    title: "One-Shot Sunday: Dungeons & Dragons",
    subtitle: "Mesas de rol guiadas para novatos y veteranos con Dungeon Master",
    time: "06:00 PM",
    badge: "D&D 5e",
    description:
      "¿Siempre quisiste aprender a jugar rol? Nuestros DMs traen personajes listos, dados y mapas para sumergirte en una aventura de 2 horas y media.",
    icon: "Dice6",
    perk: "🎲 Set de dados de cortesía para jugadores primerizos",
  },
];

// =========================================================================
// DATOS DE GESTIÓN / KPIS DEL GERENTE (MANAGER MODE)
// =========================================================================
export const INITIAL_MANAGER_KPIS: ManagerKPIs = {
  activeTables: 14,
  totalTables: 18,
  gamesInPlay: 19,
  totalGames: 52,
  todaySalesUSD: 980,
  avgTicketUSD: 34,
  pendingReservationsCount: 3,
};

export const INITIAL_LIVE_BOOKINGS: LiveBooking[] = [
  {
    id: "CRN-801",
    clientName: "Luis Ignacio Torres",
    phone: "+58 414-6321980",
    planName: "Mesa Gamer con Ludoteca Ilimitada (4 pax)",
    tableNumber: "Mesa 4 (Gamer Lounge)",
    time: "06:30 PM",
    date: "Hoy",
    pax: 4,
    status: "en_mesa",
    totalUSD: 35,
    gameInPlay: "Los Colonos de Catan",
    notes: "Celebrando cumpleaños de un amigo.",
  },
  {
    id: "CRN-802",
    clientName: "Mariana Albornoz",
    phone: "+58 424-6104432",
    planName: "Salón VIP Mazmorra / Cumpleaños (12 pax)",
    tableNumber: "Salón VIP Mazmorra",
    time: "08:00 PM",
    date: "Hoy",
    pax: 12,
    status: "confirmada",
    totalUSD: 95,
    notes: "Requieren Game Master dedicado para Secret Hitler.",
  },
  {
    id: "CRN-803",
    clientName: "Alejandro Colina",
    phone: "+58 412-5509122",
    planName: "Mesa Noche de Stand-Up Comedy (2 pax)",
    tableNumber: "Mesa 2 (Frente Escenario)",
    time: "08:15 PM",
    date: "Hoy",
    pax: 2,
    status: "confirmada",
    totalUSD: 25,
  },
  {
    id: "CRN-804",
    clientName: "Valeria Gutiérrez",
    phone: "+58 414-7788112",
    planName: "Mesa Gamer con Ludoteca Ilimitada (5 pax)",
    tableNumber: "Mesa 8",
    time: "09:00 PM",
    date: "Hoy",
    pax: 5,
    status: "pendiente",
    totalUSD: 45,
    notes: "Quieren probar Dungeons & Dragons por primera vez.",
  },
];
