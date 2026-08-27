export type CurrencyMode = "USD" | "EUR" | "VES";

export const DEFAULT_BCV_RATE = 70.5; // Dólar BCV
export const DEFAULT_EUR_BCV_RATE = 76.8; // Euro BCV

export type ExchangeRates = {
  usd: number;
  eur: number;
  lastUpdated?: string;
};

/**
 * Formatea un monto en USD, EUR o VES según la moneda seleccionada
 */
export function formatPrice(
  amountUSD: number,
  currency: CurrencyMode,
  usdRate: number = DEFAULT_BCV_RATE,
  eurRate: number = DEFAULT_EUR_BCV_RATE
): string {
  if (currency === "USD") {
    return `$${amountUSD.toFixed(amountUSD % 1 === 0 ? 0 : 2)}`;
  }

  if (currency === "EUR") {
    // Conversión aproximada USD a EUR basada en paridad de tasas BCV
    const amountEUR = amountUSD * (usdRate / (eurRate || DEFAULT_EUR_BCV_RATE));
    return `€${amountEUR.toFixed(amountEUR % 1 === 0 ? 0 : 2)}`;
  }

  // VES (Bolívares)
  const amountVES = amountUSD * usdRate;
  return `${amountVES.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Bs.`;
}

/**
 * Formatea el precio mostrando el desglose en USD, EUR y Bolívares
 */
export function formatDualPrice(
  amountUSD: number,
  usdRate: number = DEFAULT_BCV_RATE,
  eurRate: number = DEFAULT_EUR_BCV_RATE
): { usd: string; eur: string; ves: string } {
  const amountEUR = amountUSD * (usdRate / (eurRate || DEFAULT_EUR_BCV_RATE));
  const amountVES = amountUSD * usdRate;

  return {
    usd: `$${amountUSD.toFixed(amountUSD % 1 === 0 ? 0 : 2)}`,
    eur: `€${amountEUR.toFixed(amountEUR % 1 === 0 ? 0 : 2)}`,
    ves: `${amountVES.toLocaleString("es-VE", {
      maximumFractionDigits: 2,
    })} Bs.`,
  };
}
