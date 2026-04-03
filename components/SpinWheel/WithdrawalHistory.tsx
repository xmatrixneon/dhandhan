"use client";

import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useWallet } from "@/contexts/WalletContext";
import type { WithdrawalRequest } from "@/lib/withdrawalTypes";
import {
  Clock, CheckCircle2, XCircle, Loader2,
  History, IndianRupee, Phone, Banknote,
} from "lucide-react";

interface WithdrawalHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_CONFIG: Record<
  WithdrawalRequest["status"],
  { icon: React.ReactNode; label: string; color: string }
> = {
  pending:    { icon: <Clock       className="w-3 h-3" />, label: "Pending",    color: "#facc15" },
  processing: { icon: <Loader2     className="w-3 h-3 animate-spin" />, label: "Processing", color: "#60a5fa" },
  completed:  { icon: <CheckCircle2 className="w-3 h-3" />, label: "Completed", color: "#34d399" },
  rejected:   { icon: <XCircle     className="w-3 h-3" />, label: "Rejected",   color: "#f87171" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function WithdrawalHistory({ open, onOpenChange }: WithdrawalHistoryProps) {
  const { withdrawals, refreshWithdrawals } = useWallet();

  useEffect(() => {
    if (open) refreshWithdrawals();
  }, [open, refreshWithdrawals]);

  const sorted = [...withdrawals].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="border-0 text-white p-0"
        style={{
          background: "#0d0620",
          borderRadius: "24px 24px 0 0",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag pill */}
        <div className="h-1 w-10 rounded-full bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

        {/* Header — fixed, doesn't scroll */}
        <div className="px-5 pt-3 pb-4 shrink-0">
          <SheetHeader>
            <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-yellow-400" />
              Withdrawal History
            </SheetTitle>
            <p className="text-white/40 text-sm mt-1">Track all your past requests</p>
          </SheetHeader>

          {/* Summary pill */}
          {sorted.length > 0 && (
            <div
              className="mt-4 flex items-center justify-between px-4 py-3 rounded-2xl border border-white/10"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <span className="text-white/50 text-sm">Total Requests</span>
              <span className="text-yellow-400 font-black text-lg">{sorted.length}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mx-5 shrink-0" />

        {/* Scrollable list */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-4"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <History className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/50 font-semibold text-base">No withdrawals yet</p>
              <p className="text-white/25 text-sm mt-1">
                Your requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((w) => {
                const cfg = STATUS_CONFIG[w.status];
                return (
                  <div
                    key={w.id}
                    className="rounded-2xl border border-white/8 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    {/* Top bar: status + amount */}
                    <div
                      className="flex items-center justify-between px-4 py-3 border-b border-white/6"
                      style={{ background: `${cfg.color}0d` }}
                    >
                      {/* Status badge */}
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold"
                        style={{
                          color: cfg.color,
                          borderColor: `${cfg.color}40`,
                          background: `${cfg.color}18`,
                        }}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </div>

                      {/* Amount */}
                      <div className="flex items-center gap-1 font-black text-xl text-white">
                        <IndianRupee className="w-4 h-4 text-yellow-400" />
                        <span style={{ color: cfg.color }}>
                          {w.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-white/30 shrink-0" />
                        <span className="text-white/55 text-xs">{w.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Banknote className="w-3.5 h-3.5 text-white/30 shrink-0" />
                        <span className="text-white/55 text-xs">{w.upiId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                        <span className="text-white/35 text-[11px]">{formatDate(w.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}