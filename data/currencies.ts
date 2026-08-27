export type CurrencyMode = "USD" | "VES";

export const DEFAULT_BCV_RATE = 70.5;

/**
 * Formatea un monto en USD o VES según la moneda seleccionada
 */
export function formatPrice(
  amountUSD: number,
  currency: CurrencyMode,
  rate: number = DEFAULT_BCV_RATE
): string {
  if (currency === "USD") {
    return `$${amountUSD.toFixed(amountUSD % 1 === 0 ? 0 : 2)}`;
  }
  const amountVES = amountUSD * rate;
  return `${amountVES.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Bs.`;
}

/**
 * Formatea el precio mostrando ambas monedas (ej. $10 / 705 Bs.)
 */
export function formatDualPrice(
  amountUSD: number,
  rate: number = DEFAULT_BCV_RATE
): { usd: string; ves: string } {
  return {
    usd: `$${amountUSD.toFixed(amountUSD % 1 === 0 ? 0 : 2)}`,
    ves: `${(amountUSD * rate).toLocaleString("es-VE", {
      maximumFractionDigits: 2,
    })} Bs.`,
  };
}
