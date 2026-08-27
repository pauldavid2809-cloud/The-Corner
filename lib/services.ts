import { supabase, isSupabaseConfigured } from "./supabase";
import {
  BoardGame,
  MenuItem,
  LiveBooking,
  BOARD_GAMES,
  MENU_ITEMS,
  INITIAL_LIVE_BOOKINGS,
  PaymentMethod,
  PaymentStatus,
} from "@/data/cornerData";
import { DEFAULT_BCV_RATE } from "@/data/currencies";

/**
 * =========================================================================
 * SERVICIOS DE TASA BCV EN VIVO (EURO BCV)
 * =========================================================================
 */

export async function fetchLiveExchangeRates(): Promise<number> {
  try {
    const res = await fetch("/api/bcv", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return Number(data.rate || data.bcvRate) || DEFAULT_BCV_RATE;
    }
  } catch (err) {
    console.warn("No se pudo consultar /api/bcv directamente:", err);
  }

  return DEFAULT_BCV_RATE;
}

export async function fetchBcvRateFromSupabase(): Promise<number> {
  if (!isSupabaseConfigured || !supabase) {
    return fetchLiveExchangeRates();
  }

  try {
    const { data, error } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "bcv_rate")
      .single();

    if (error || !data) {
      return fetchLiveExchangeRates();
    }

    const val = data.value;
    return Number(val?.rate || val?.bcvRate || val?.eur || val?.usd) || DEFAULT_BCV_RATE;
  } catch (err) {
    return fetchLiveExchangeRates();
  }
}

export async function updateExchangeRatesInSupabase(rate: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const { error } = await supabase.from("app_config").upsert([
      {
        key: "bcv_rate",
        value: {
          rate: rate,
          updated_at: new Date().toISOString(),
        },
      },
    ]);
    return !error;
  } catch (err) {
    console.error("Error updating exchange rate:", err);
    return false;
  }
}

/**
 * =========================================================================
 * SERVICIOS DE RESERVAS Y PAGOS / BOOKINGS
 * =========================================================================
 */

export async function fetchBookingsFromSupabase(): Promise<LiveBooking[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_LIVE_BOOKINGS;
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_LIVE_BOOKINGS;
    }

    return data.map((b) => ({
      id: b.code || b.id,
      clientName: b.client_name,
      phone: b.client_phone,
      planName: b.plan_name,
      tableNumber: b.table_number || "Por Asignar",
      time: b.time,
      date: b.date,
      pax: b.pax,
      status: b.status as any,
      totalUSD: Number(b.total_usd),
      notes: b.notes,
      gameInPlay: b.game_in_play,
      paymentMethod: (b.payment_method as PaymentMethod) || "pago_movil",
      paymentReference: b.payment_reference || undefined,
      paymentBank: b.payment_bank || undefined,
      paymentStatus: (b.payment_status as PaymentStatus) || "pendiente",
      paymentAmountVES: Number(b.total_ves) || undefined,
    }));
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return INITIAL_LIVE_BOOKINGS;
  }
}

export async function saveBookingToSupabase(booking: {
  code: string;
  clientName: string;
  clientPhone: string;
  planId: string;
  planName: string;
  date: string;
  time: string;
  pax: number;
  totalUSD: number;
  totalVES: number;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentBank?: string;
  paymentStatus?: PaymentStatus;
}): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase.from("bookings").insert([
      {
        code: booking.code,
        client_name: booking.clientName,
        client_phone: booking.clientPhone,
        plan_id: booking.planId,
        plan_name: booking.planName,
        table_number: "Por Asignar",
        date: booking.date,
        time: booking.time,
        pax: booking.pax,
        status: "pendiente",
        total_usd: booking.totalUSD,
        total_ves: booking.totalVES,
        notes: booking.notes || null,
        payment_method: booking.paymentMethod,
        payment_reference: booking.paymentReference || null,
        payment_bank: booking.paymentBank || null,
        payment_status: booking.paymentStatus || "pendiente",
      },
    ]);

    return !error;
  } catch (err) {
    console.error("Supabase booking insert exception:", err);
    return false;
  }
}

export async function updatePaymentStatusInSupabase(
  codeOrId: string,
  paymentStatus: PaymentStatus,
  approvedBy?: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const { error } = await supabase
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        status: paymentStatus === "aprobado" ? "confirmada" : "pendiente",
        approved_by: approvedBy || "Gerente General",
        approved_at: new Date().toISOString(),
      })
      .or(`code.eq.${codeOrId},id.eq.${codeOrId}`);

    return !error;
  } catch (err) {
    console.error("Error updating payment status in Supabase:", err);
    return false;
  }
}

/**
 * =========================================================================
 * SERVICIOS DE MENÚ & PROMOS
 * =========================================================================
 */

export async function fetchMenuFromSupabase(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return MENU_ITEMS;
  }

  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return MENU_ITEMS;
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category as any,
      description: item.description,
      priceUSD: Number(item.price_usd),
      badge: item.badge,
      spicy: item.spicy,
      popular: item.popular,
      tags: item.tags || [],
    }));
  } catch (err) {
    console.error("Error fetching menu:", err);
    return MENU_ITEMS;
  }
}

export async function saveMenuItemToSupabase(item: MenuItem): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const { error } = await supabase.from("menu_items").upsert([
      {
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        price_usd: item.priceUSD,
        badge: item.badge || null,
        spicy: Boolean(item.spicy),
        popular: Boolean(item.popular),
        tags: item.tags || [],
      },
    ]);
    return !error;
  } catch (err) {
    console.error("Error saving menu item:", err);
    return false;
  }
}

export async function deleteMenuItemFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    return !error;
  } catch (err) {
    console.error("Error deleting menu item:", err);
    return false;
  }
}

/**
 * =========================================================================
 * SERVICIOS DE JUEGOS Y ENTRETENIMIENTO
 * =========================================================================
 */

export async function fetchGamesFromSupabase(): Promise<BoardGame[]> {
  if (!isSupabaseConfigured || !supabase) {
    return BOARD_GAMES;
  }

  try {
    const { data, error } = await supabase
      .from("board_games")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return BOARD_GAMES;
    }

    return data.map((g) => ({
      id: g.id,
      name: g.name,
      category: g.category as any,
      players: g.players,
      duration: g.duration,
      difficulty: g.difficulty as any,
      description: g.description,
      rulesSummary: g.rules_summary,
      tags: g.tags || [],
      image: g.image_url || "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
      badge: g.badge,
      popular: g.popular,
      minPlayers: 2,
      maxPlayers: 8,
      minMinutes: 30,
    }));
  } catch (err) {
    console.error("Error fetching games:", err);
    return BOARD_GAMES;
  }
}

export async function saveGameToSupabase(game: BoardGame): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const { error } = await supabase.from("board_games").upsert([
      {
        id: game.id,
        name: game.name,
        category: game.category,
        players: game.players,
        duration: game.duration,
        difficulty: game.difficulty,
        description: game.description,
        rules_summary: game.rulesSummary,
        badge: game.badge || null,
        popular: Boolean(game.popular),
        tags: game.tags || [],
      },
    ]);
    return !error;
  } catch (err) {
    console.error("Error saving board game:", err);
    return false;
  }
}
