"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { claimDailyBonus, getDailyBonusInfo, DAILY_BONUS_AMOUNTS } from "@/lib/walletUtils";
import { toast } from "sonner";
import { Calendar, Gift, CheckCircle2, Flame, Clock, TrendingUp } from "lucide-react";

interface DailyBonusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailyBonus({ open, onOpenChange }: DailyBonusProps) {
  const [info, setInfo] = useState(getDailyBonusInfo);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) setInfo(getDailyBonusInfo()); }, [open]);

  const handleClaim = async () => {
    if (!info.canClaim) { toast.error("Already claimed today! Come back tomorrow."); return; }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    const res = claimDailyBonus();
    if (res.success) {
      toast.success(`🎉 +₹${res.bonusAmount} claimed!`, {
        description: `Streak: ${res.newStreak ?? 1} day${(res.newStreak ?? 1) > 1 ? "s" : ""}`,
      });
      setInfo(getDailyBonusInfo());
    } else {
      toast.error(res.error ?? "Failed to claim");
    }
    setBusy(false);
  };

  const streakEmoji =
    info.currentStreak >= 30 ? "🔥" :
    info.currentStreak >= 14 ? "⚡" :
    info.currentStreak >= 7  ? "💪" :
    info.currentStreak >= 3  ? "🌟" : "✨";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="border-0 text-white p-0"
        style={{
          background: "#0d0620",
          borderRadius: "24px 24px 0 0",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag pill */}
        <div className="h-1 w-10 rounded-full bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

        {/* Fixed header */}
        <div className="px-5 pt-3 pb-4 shrink-0">
          <SheetHeader>
            <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              Daily Bonus
            </SheetTitle>
            <p className="text-white/40 text-sm mt-1">
              Claim every day to build your streak
            </p>
          </SheetHeader>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mx-5 shrink-0" />

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >

          {/* Streak hero card */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden border border-white/10"
            style={{
              background: "linear-gradient(135deg,rgba(249,115,22,0.18),rgba(250,204,21,0.10))",
            }}
          >
            {/* Decorative blob */}
            <div
              className="absolute -right-6 -top-6 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "rgba(250,204,21,0.08)" }}
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                  Current Streak
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl">{streakEmoji}</span>
                  <span className="text-4xl font-black text-white">{info.currentStreak}</span>
                  <span className="text-white/50 text-base">
                    day{info.currentStreak !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <Flame
                className={`w-10 h-10 shrink-0 ${
                  info.currentStreak >= 7 ? "text-orange-400" : "text-white/12"
                }`}
              />
            </div>
          </div>

          {/* Next bonus + availability row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4 border border-white/8"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-white/45 text-xs mb-1">Next Bonus</p>
              <p className="text-yellow-400 font-black text-2xl">₹{info.nextBonusAmount}</p>
              <p className="text-white/30 text-[10px] mt-1">Day {info.currentStreak + 1}</p>
            </div>
            <div
              className="rounded-2xl p-4 border flex flex-col justify-between"
              style={{
                background: info.canClaim ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
                borderColor: info.canClaim ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-white/45 text-xs mb-1">Status</p>
              <div className="flex items-center gap-1.5">
                {info.canClaim
                  ? <><Gift  className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400 font-bold text-sm">Available!</span></>
                  : <><Clock className="w-4 h-4 text-white/30" />  <span className="text-white/40 font-bold text-sm">Tomorrow</span></>}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4 text-center border border-white/8"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <TrendingUp className="w-5 h-5 mx-auto mb-1.5 text-blue-400" />
              <p className="text-2xl font-black text-white">{info.totalDays}</p>
              <p className="text-white/40 text-xs mt-0.5">Total Days</p>
            </div>
            <div
              className="rounded-2xl p-4 text-center border border-white/8"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Flame className="w-5 h-5 mx-auto mb-1.5 text-orange-400" />
              <p className="text-2xl font-black text-white">{info.currentStreak}</p>
              <p className="text-white/40 text-xs mt-0.5">Best Streak</p>
            </div>
          </div>

          {/* Bonus progression grid */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
              Bonus Schedule
            </p>
            <div className="grid grid-cols-4 gap-2">
              {DAILY_BONUS_AMOUNTS.map((amt, i) => {
                const day    = i + 1;
                const isPast = day <= info.currentStreak;
                const isNext = day === info.currentStreak + 1;

                return (
                  <div
                    key={i}
                    className="rounded-xl p-2.5 text-center border transition-all"
                    style={{
                      background: isPast
                        ? "rgba(52,211,153,0.10)"
                        : isNext
                        ? "rgba(250,204,21,0.10)"
                        : "rgba(255,255,255,0.03)",
                      borderColor: isPast
                        ? "rgba(52,211,153,0.35)"
                        : isNext
                        ? "rgba(250,204,21,0.45)"
                        : "rgba(255,255,255,0.07)",
                    }}
                  >
                    <p
                      className="text-[9px] font-semibold mb-1"
                      style={{
                        color: isPast ? "#34d399" : isNext ? "#facc15" : "rgba(255,255,255,0.22)",
                      }}
                    >
                      Day {day}
                    </p>
                    <p
                      className="text-sm font-black"
                      style={{
                        color: isPast ? "#34d399" : isNext ? "#facc15" : "rgba(255,255,255,0.28)",
                      }}
                    >
                      ₹{amt}
                    </p>
                    {isPast && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto mt-1" />
                    )}
                    {isNext && (
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mx-auto mt-1 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Claim button */}
          <button
            onClick={handleClaim}
            disabled={!info.canClaim || busy}
            className="w-full rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              height: 52,
              background:
                info.canClaim && !busy
                  ? "linear-gradient(135deg,#facc15,#f97316)"
                  : "rgba(255,255,255,0.07)",
              color: info.canClaim && !busy ? "#080514" : "rgba(255,255,255,0.28)",
              cursor: info.canClaim && !busy ? "pointer" : "not-allowed",
              boxShadow:
                info.canClaim && !busy ? "0 6px 24px rgba(250,204,21,0.35)" : "none",
            }}
          >
            {busy ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                  style={{ animation: "spin 0.7s linear infinite" }}
                />
                Claiming…
              </>
            ) : info.canClaim ? (
              <><Gift className="w-5 h-5" /> Claim ₹{info.nextBonusAmount}</>
            ) : (
              <><CheckCircle2 className="w-5 h-5" /> Claimed Today</>
            )}
          </button>

          {!info.canClaim && (
            <p className="text-center text-white/25 text-xs pb-2">
              Come back tomorrow to continue your streak!
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}