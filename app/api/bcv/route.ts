import { NextResponse } from "next/server";

export const revalidate = 300; // Cache de 5 minutos

export async function GET() {
  let eurRate = 76.8;
  let lastUpdated = new Date().toISOString();
  let source = "BCV Oficial (Euro)";

  try {
    // Consultar la tasa oficial del Euro BCV (utilizada para la conversión oficial a Bs.)
    const res = await fetch("https://ve.dolarapi.com/v1/euros/oficial", {
      next: { revalidate: 300 },
      headers: { "User-Agent": "TheCornerWebApp/1.0" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.promedio) {
        eurRate = Number(data.promedio);
        if (data.fechaActualizacion) {
          lastUpdated = data.fechaActualizacion;
        }
      }
    } else {
      // Fallback endpoint
      const altRes = await fetch("https://ve.dolarapi.com/v1/euros", {
        next: { revalidate: 300 },
      });
      if (altRes.ok) {
        const altData = await altRes.json();
        if (Array.isArray(altData) && altData[0]?.promedio) {
          eurRate = Number(altData[0].promedio);
        } else if (altData?.promedio) {
          eurRate = Number(altData.promedio);
        }
      }
    }

    return NextResponse.json({
      success: true,
      rate: eurRate,
      bcvRate: eurRate,
      lastUpdated,
      source,
    });
  } catch (error) {
    console.error("Error fetching Euro BCV rate:", error);
    return NextResponse.json({
      success: false,
      rate: eurRate,
      bcvRate: eurRate,
      lastUpdated,
      source: "Fallback BCV",
    });
  }
}
