"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Clock, Smartphone, Gamepad2, AlertCircle, Shield, Banknote } from "lucide-react";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TERMS = [
  { icon: <Smartphone className="w-4 h-4" />, color: "#8b5cf6", title: "App Installation", body: "Download from official app stores only. We are not responsible for apps from unauthorized sources." },
  { icon: <Clock       className="w-4 h-4" />, color: "#60a5fa", title: "Withdrawal Processing", body: "All requests processed in 24–48 hours. Ensure your UPI details are correct." },
  { icon: <Gamepad2    className="w-4 h-4" />, color: "#34d399", title: "Daily Play Required", body: "Play daily to maintain your streak. Missing a day resets your streak bonus." },
  { icon: <AlertCircle className="w-4 h-4" />, color: "#facc15", title: "Spin Limits", body: "Limited to 2 spins per 24 hours. Additional spins available after the window expires." },
  { icon: <Shield      className="w-4 h-4" />, color: "#f87171", title: "Fair Play Policy", body: "Any manipulation or exploitation results in immediate account suspension and forfeiture of winnings." },
  { icon: <Banknote    className="w-4 h-4" />, color: "#fb923c", title: "Withdrawal Terms", body: "Minimum ₹1 per withdrawal. We are not liable for losses due to incorrect payment details." },
  { icon: <FileText    className="w-4 h-4" />, color: "#94a3b8", title: "Account Responsibility", body: "You are responsible for all activities under your account. Keep your details confidential." },
];

export function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm rounded-3xl border-0 text-white p-0 overflow-hidden"
        style={{ background: "#0d0620", maxHeight: "88vh" }}>
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#6d28d9,#ec4899,#f97316)" }} />

        <div className="px-5 pt-5 pb-2">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-400" /> Terms &amp; Conditions
            </DialogTitle>
            <p className="text-white/40 text-sm mt-1">Read before playing</p>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: "calc(88vh - 140px)" }}>
          <div className="space-y-3 mt-2">
            {TERMS.map(({ icon, color, title, body }) => (
              <div key={title}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/8"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}22`, color }}>
                  {icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-white/45 text-xs mt-0.5 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}

            <p className="text-white/25 text-[10px] text-center py-2">
              By playing Dhana Dhan you agree to these terms · Last updated April 2026
            </p>
          </div>
        </div>

        <div className="px-5 pb-5 pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full rounded-2xl h-12 font-bold text-[#080514] active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg,#facc15,#f97316)" }}>
            I Understand ✓
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}