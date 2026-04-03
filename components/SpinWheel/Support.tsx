"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HelpCircle, Mail, Clock, Gamepad2, AlertCircle, Smartphone, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SupportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FAQ = [
  {
    q: "How do I withdraw my winnings?",
    a: "Go to the Wallet tab → Withdraw Funds. Enter your phone number, UPI ID, and amount. Minimum withdrawal is ₹1.",
  },
  {
    q: "How long does a withdrawal take?",
    a: "All withdrawals are processed within 24–48 hours to your UPI ID.",
  },
  {
    q: "What happens if I miss a daily bonus?",
    a: "Your streak resets to zero. Play every day to maximise your bonus rewards!",
  },
  {
    q: "How do I earn more spins?",
    a: "You get 2 free spins every 24 hours. Claim your daily bonus and refer friends for extra rewards.",
  },
];

export function Support({ open, onOpenChange }: SupportProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom"
        className="rounded-t-3xl border-0 text-white"
        style={{ background: "#0d0620", maxHeight: "92vh", overflowY: "auto" }}>

        <div className="h-1 w-10 rounded-full bg-white/20 mx-auto mb-5 mt-1" />

        <SheetHeader className="mb-5">
          <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-yellow-400" /> Help &amp; Support
          </SheetTitle>
          <p className="text-white/40 text-sm">Get answers and contact us</p>
        </SheetHeader>

        <div className="space-y-4 pb-8">
          {/* Contact */}
          <button
            onClick={() => window.open("mailto:support@dhanadhan.com", "_blank")}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/8 active:bg-white/8 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#6d28d9,#ec4899)" }}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Email Support</p>
              <p className="text-white/40 text-xs mt-0.5">support@dhanadhan.com</p>
            </div>
          </button>

          {/* Quick info tiles */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Clock className="w-4 h-4" />, title: "Withdrawals", body: "24–48 hrs processing" },
              { icon: <AlertCircle className="w-4 h-4" />, title: "Spin Limit", body: "2 spins per 24 hrs" },
              { icon: <Gamepad2 className="w-4 h-4" />, title: "Daily Play", body: "Keep your streak!" },
              { icon: <Smartphone className="w-4 h-4" />, title: "App", body: "Official stores only" },
            ].map(({ icon, title, body }) => (
              <div key={title}
                className="rounded-xl p-3 border border-white/8"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-yellow-400 mb-1">{icon}</div>
                <p className="text-white font-semibold text-xs">{title}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{body}</p>
              </div>
            ))}
          </div>

          {/* FAQ accordion */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">FAQ</p>
            <div className="space-y-2">
              {FAQ.map((item, i) => (
                <div key={i}
                  className="rounded-2xl border border-white/8 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
                    <p className="text-white/80 text-sm font-medium leading-snug">{item.q}</p>
                    <ChevronDown
                      className="w-4 h-4 text-white/30 shrink-0 transition-transform duration-200"
                      style={{ transform: expanded === i ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                  {expanded === i && (
                    <div className="px-4 pb-4">
                      <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}