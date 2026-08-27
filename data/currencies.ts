export type CurrencyMode = "USD" | "VES";

export const DEFAULT_BCV_RATE = 76.8; // Tasa oficial Euro BCV para cálculo de Bolívares

/**
 * Formatea un monto en USD o VES según la moneda seleccionada (calculado con la tasa Euro BCV)
 */
export function formatPrice(
  amountUSD: number,
  currency: CurrencyMode,
  bcvRate: number = DEFAULT_BCV_RATE
): string {
  if (currency === "USD") {
    return `$${amountUSD.toFixed(amountUSD % 1 === 0 ? 0 : 2)}`;
  }

  // VES (Bolívares calculados con la tasa oficial Euro BCV)
  const amountVES = amountUSD * bcvRate;
  return `${amountVES.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Bs.`;
}

/**
 * Formatea el precio mostrando ambas monedas ($ USD y Bs. VES calculados con tasa Euro BCV)
 */
export function formatDualPrice(
  amountUSD: number,
  bcvRate: number = DEFAULT_BCV_RATE
): { usd: string; ves: string } {
  const amountVES = amountUSD * bcvRate;

  return {
    usd: `$${amountUSD.toFixed(amountUSD % 1 === 0 ? 0 : 2)}`,
    ves: `${amountVES.toLocaleString("es-VE", {
      maximumFractionDigits: 2,
    })} Bs.`,
  };
}
