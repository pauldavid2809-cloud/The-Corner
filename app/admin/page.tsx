"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ManagerDashboard } from "@/components/ManagerDashboard";
import { DEFAULT_BCV_RATE } from "@/data/currencies";
import { fetchBcvRateFromSupabase, fetchLiveExchangeRates } from "@/lib/services";

export default function AdminPage() {
  const router = useRouter();
  const [bcvRate, setBcvRate] = useState<number>(DEFAULT_BCV_RATE);

  useEffect(() => {
    fetchLiveExchangeRates().then((rates) => {
      if (rates.usd) setBcvRate(rates.usd);
    });

    fetchBcvRateFromSupabase().then((rates) => {
      if (rates?.usd) setBcvRate(rates.usd);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <ManagerDashboard
        onExitManagerMode={() => router.push("/")}
        bcvRate={bcvRate}
        onUpdateBcvRate={(newRate) => setBcvRate(newRate)}
      />
    </div>
  );
}
