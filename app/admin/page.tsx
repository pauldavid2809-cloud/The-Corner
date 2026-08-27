"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ManagerDashboard } from "@/components/ManagerDashboard";
import { DEFAULT_BCV_RATE } from "@/data/currencies";

export default function AdminPage() {
  const router = useRouter();
  const [bcvRate, setBcvRate] = useState<number>(DEFAULT_BCV_RATE);

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
