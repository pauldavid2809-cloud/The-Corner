import { NextResponse } from "next/server";

export const revalidate = 300; // Cache de 5 minutos

export async function GET() {
  let usdRate = 70.5;
  let eurRate = 76.8;
  let lastUpdated = new Date().toISOString();
  let source = "BCV Oficial";

  try {
    // 1. Consultar API oficial de Dólar y Euro BCV
    const [usdRes, eurRes] = await Promise.allSettled([
      fetch("https://ve.dolarapi.com/v1/dolares/oficial", {
        next: { revalidate: 300 },
        headers: { "User-Agent": "TheCornerWebApp/1.0" },
      }),
      fetch("https://ve.dolarapi.com/v1/euros/oficial", {
        next: { revalidate: 300 },
        headers: { "User-Agent": "TheCornerWebApp/1.0" },
      }),
    ]);

    if (usdRes.status === "fulfilled" && usdRes.value.ok) {
      const usdData = await usdRes.value.json();
      if (usdData?.promedio) {
        usdRate = Number(usdData.promedio);
        if (usdData.fechaActualizacion) {
          lastUpdated = usdData.fechaActualizacion;
        }
      }
    }

    if (eurRes.status === "fulfilled" && eurRes.value.ok) {
      const eurData = await eurRes.value.json();
      if (eurData?.promedio) {
        eurRate = Number(eurData.promedio);
      }
    } else {
      // Intento con endpoint secundario de Euro
      try {
        const altEurRes = await fetch("https://ve.dolarapi.com/v1/euros", {
          next: { revalidate: 300 },
        });
        if (altEurRes.ok) {
          const altData = await altEurRes.json();
          if (Array.isArray(altData) && altData[0]?.promedio) {
            eurRate = Number(altData[0].promedio);
          } else if (altData?.promedio) {
            eurRate = Number(altData.promedio);
          }
        }
      } catch (e) {
        // Ignorar y usar fallback
      }
    }

    return NextResponse.json({
      success: true,
      usd: usdRate,
      eur: eurRate,
      rates: {
        usd: usdRate,
        eur: eurRate,
      },
      lastUpdated,
      source,
    });
  } catch (error) {
    console.error("Error fetching BCV rates:", error);
    return NextResponse.json({
      success: false,
      usd: usdRate,
      eur: eurRate,
      rates: {
        usd: usdRate,
        eur: eurRate,
      },
      lastUpdated,
      source: "Fallback BCV",
    });
  }
}
