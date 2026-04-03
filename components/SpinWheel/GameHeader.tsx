"use client";

import { useWallet } from "@/contexts/WalletContext";
import { Wallet } from "lucide-react";

export function GameHeader() {
  const { balance } = useWallet();

  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b border-white/8"
      style={{ background: "rgba(8,5,20,0.9)", backdropFilter: "blur(12px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg,#6d28d9,#ec4899)" }}
        >
          <span className="text-white font-black text-xs">DD</span>
        </div>
        <div>
          <h1 className="text-white font-extrabold text-sm leading-tight tracking-wide">
            धना धन
          </h1>
          <p className="text-white/35 text-[9px] leading-tight">Spin &amp; Win</p>
        </div>
      </div>

      {/* Balance pill */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <Wallet className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-white/60 text-[10px] font-medium">₹</span>
        <span className="text-yellow-400 font-black text-sm">
          {balance.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}