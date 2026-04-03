"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SpinWheelCanvas } from "@/components/SpinWheel/SpinWheelCanvas";
import { WheelPointer } from "@/components/SpinWheel/WheelPointer";
import { Confetti } from "@/components/SpinWheel/Confetti";
import { UnifiedTicker } from "@/components/SpinWheel/UnifiedTicker";
import { GameHeader } from "@/components/SpinWheel/GameHeader";
import { WithdrawalDialog } from "@/components/SpinWheel/WithdrawalDialog";
import { WithdrawalHistory } from "@/components/SpinWheel/WithdrawalHistory";
import { ReferralSystem } from "@/components/SpinWheel/ReferralSystem";
import { DailyBonus } from "@/components/SpinWheel/DailyBonus";
import { Support } from "@/components/SpinWheel/Support";
import { TermsDialog } from "@/components/SpinWheel/TermsDialog";
import { PRIZES, TARGET_PRIZE_INDEX, WHEEL_SIZE, MIN_TAP_TARGET } from "@/lib/constants";
import { calculateTargetRotation, animateWheel } from "@/lib/wheelUtils";
import { canSpin, recordSpin } from "@/lib/walletUtils";
import { useWallet } from "@/contexts/WalletContext";
import type { Prize } from "@/lib/constants";
import { Home, Gift, Wallet, HelpCircle, Flame, Clock, Trophy, ChevronRight } from "lucide-react";

type Tab = "play" | "earn" | "wallet" | "help";

export function SpinWheel() {
  const { balance, addWinnings } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>("play");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showDailyBonusDialog, setShowDailyBonusDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [spinStatus, setSpinStatus] = useState(canSpin());

  const targetPrize = PRIZES[TARGET_PRIZE_INDEX];

  useEffect(() => {
    const interval = setInterval(() => setSpinStatus(canSpin()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;
    const spinCheck = canSpin();
    if (!spinCheck.canSpin) {
      const hours = Math.ceil(((spinCheck.nextSpinTime ?? Date.now()) - Date.now()) / 3_600_000);
      toast.error(`Come back in ${hours}h!`, { description: "You've used your 2 free spins today" });
      return;
    }
    setIsSpinning(true);
    setCurrentPrize(null);
    setShowWinnerDialog(false);
    recordSpin();
    const targetRotation = calculateTargetRotation();
    const startTime = performance.now();
    animateWheel(
      startTime,
      targetRotation,
      (r) => setRotation(r),
      () => {
        setIsSpinning(false);
        setCurrentPrize(targetPrize);
        setShowWinnerDialog(true);
        addWinnings(targetPrize.value);
        setSpinStatus(canSpin());
        toast.success(`🎉 You won ${targetPrize.label}!`, {
          description: `+₹${targetPrize.value} added to your balance`,
          duration: 5000,
          position: "top-center",
        });
      }
    );
  };

  const hoursLeft = spinStatus.nextSpinTime
    ? Math.ceil((spinStatus.nextSpinTime - Date.now()) / 3_600_000)
    : 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "play",   label: "Play",   icon: <Home   className="w-5 h-5" /> },
    { id: "earn",   label: "Earn",   icon: <Gift   className="w-5 h-5" /> },
    { id: "wallet", label: "Wallet", icon: <Wallet className="w-5 h-5" /> },
    { id: "help",   label: "Help",   icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <>
      <Confetti active={showWinnerDialog} />

      <div
        className="fixed inset-0 flex flex-col bg-[#080514] overflow-hidden select-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />
        </div>

        {/* ── HEADER ── */}
        <div className="relative z-10 shrink-0">
          <GameHeader />
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">

          {/* PLAY TAB */}
          {activeTab === "play" && (
            <div className="flex flex-col items-center px-4 pt-2 pb-4 h-full">
              {/* Ticker */}
              <div className="w-full mb-3">
                <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <UnifiedTicker />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-2">
                <h1 className="text-3xl font-extrabold tracking-tight"
                  style={{ background: "linear-gradient(135deg,#facc15,#f97316,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  धना धन
                </h1>
                <p className="text-white/40 text-xs mt-0.5">
                  Win up to <span className="text-yellow-400 font-semibold">₹5,000</span> per spin
                </p>
              </div>

              {/* Wheel */}
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute rounded-full pointer-events-none"
                  style={{ width: WHEEL_SIZE + 48, height: WHEEL_SIZE + 48, background: "radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%)" }} />
                <div className="absolute rounded-full border-2 border-dashed border-yellow-500/25 pointer-events-none"
                  style={{ width: WHEEL_SIZE + 22, height: WHEEL_SIZE + 22, animation: `spin ${isSpinning ? 3 : 18}s linear infinite` }} />
                <WheelPointer />
                <SpinWheelCanvas prizes={PRIZES} rotation={rotation} size={WHEEL_SIZE} />
              </div>

              {/* Spin dots */}
              <div className="flex items-center gap-2 mb-3">
                {[0, 1].map((i) => (
                  <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                    i < (spinStatus.remainingSpins ?? 0)
                      ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.7)]"
                      : "bg-white/15"
                  }`} />
                ))}
                <span className="text-white/50 text-xs ml-1">
                  {spinStatus.canSpin
                    ? `${spinStatus.remainingSpins} spin${spinStatus.remainingSpins !== 1 ? "s" : ""} left`
                    : `Resets in ${hoursLeft}h`}
                </span>
              </div>

              {/* Spin button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning || !spinStatus.canSpin}
                className={`w-full rounded-2xl font-black text-lg tracking-wide flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 ${
                  isSpinning || !spinStatus.canSpin
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "text-[#080514] shadow-[0_6px_28px_rgba(250,204,21,0.45)]"
                }`}
                style={{
                  minHeight: MIN_TAP_TARGET,
                  height: 54,
                  background: !isSpinning && spinStatus.canSpin
                    ? "linear-gradient(135deg,#facc15,#f97316)" : undefined,
                }}
              >
                {isSpinning ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation: "spin 0.7s linear infinite" }} /> Spinning…</>
                ) : !spinStatus.canSpin ? (
                  <><Clock className="w-5 h-5" /> Come back in {hoursLeft}h</>
                ) : (
                  <><Flame className="w-5 h-5" /> Spin &amp; Win!</>
                )}
              </button>
            </div>
          )}

          {/* EARN TAB */}
          {activeTab === "earn" && (
            <div className="px-4 pt-4 pb-6 space-y-3">
              <h2 className="text-white font-bold text-lg mb-1">Earn More</h2>

              <button onClick={() => setShowDailyBonusDialog(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/7 border border-white/10 active:bg-white/12 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#f97316,#facc15)" }}>
                  <Trophy className="w-6 h-6 text-[#080514]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Daily Bonus</p>
                  <p className="text-white/45 text-xs mt-0.5">Claim your streak reward every day</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>

              <button onClick={() => setShowReferralDialog(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/7 border border-white/10 active:bg-white/12 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Refer &amp; Earn</p>
                  <p className="text-white/45 text-xs mt-0.5">Invite friends and grow your network</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>

              {/* Bonus info strip */}
              <div className="rounded-2xl p-4 border border-yellow-500/20"
                style={{ background: "linear-gradient(135deg,rgba(250,204,21,0.08),rgba(249,115,22,0.08))" }}>
                <p className="text-yellow-400 font-bold text-sm mb-1">💡 Pro Tip</p>
                <p className="text-white/55 text-xs leading-relaxed">
                  Claim your daily bonus every day to build a streak. A 7-day streak doubles your bonus!
                </p>
              </div>
            </div>
          )}

          {/* WALLET TAB */}
          {activeTab === "wallet" && (
            <div className="px-4 pt-4 pb-6 space-y-3">
              <h2 className="text-white font-bold text-lg mb-1">Your Wallet</h2>

              {/* Balance card */}
              <div className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#6d28d9,#ec4899)" }}>
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
                <p className="text-white/70 text-xs mb-1">Total Balance</p>
                <p className="text-white font-black text-4xl tracking-tight">
                  ₹{balance.toLocaleString("en-IN")}
                </p>
                <p className="text-white/60 text-xs mt-2">Available to withdraw</p>
              </div>

              <button onClick={() => setShowWithdrawalDialog(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/7 border border-white/10 active:bg-white/12 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Withdraw Funds</p>
                  <p className="text-white/45 text-xs mt-0.5">Send to your UPI in 24–48 hours</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>

              <button onClick={() => setShowHistoryDialog(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/7 border border-white/10 active:bg-white/12 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#6d28d9)" }}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Withdrawal History</p>
                  <p className="text-white/45 text-xs mt-0.5">Track all your past requests</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>
            </div>
          )}

          {/* HELP TAB */}
          {activeTab === "help" && (
            <div className="px-4 pt-4 pb-6 space-y-3">
              <h2 className="text-white font-bold text-lg mb-1">Help &amp; Info</h2>

              <button onClick={() => setShowSupportDialog(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/7 border border-white/10 active:bg-white/12 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}>
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Support &amp; FAQ</p>
                  <p className="text-white/45 text-xs mt-0.5">Get help, read common questions</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>

              <button onClick={() => setShowTermsDialog(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/7 border border-white/10 active:bg-white/12 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#64748b,#334155)" }}>
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm">Terms &amp; Conditions</p>
                  <p className="text-white/45 text-xs mt-0.5">Rules and fair-play policy</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>

              <div className="rounded-2xl p-4 border border-white/8 bg-white/5">
                <p className="text-white/35 text-xs text-center">
                  Dhana Dhan v1.0 · support@dhanadhan.com
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM TAB BAR ── */}
        <div
          className="relative z-20 shrink-0 border-t border-white/10 bg-[#0d0620]/95 backdrop-blur-xl"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center gap-1 pt-3 pb-1 transition-colors active:opacity-70"
                >
                  <div className={`transition-all duration-200 ${active ? "text-yellow-400 scale-110" : "text-white/35"}`}>
                    {tab.icon}
                  </div>
                  <span className={`text-[10px] font-semibold tracking-wide transition-colors ${active ? "text-yellow-400" : "text-white/35"}`}>
                    {tab.label}
                  </span>
                  {active && (
                    <div className="w-1 h-1 rounded-full bg-yellow-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── WINNER DIALOG ── */}
      <Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <DialogContent className="sm:max-w-sm rounded-3xl border-0 bg-[#0d0620] text-white overflow-hidden p-0">
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#6d28d9,#ec4899,#f97316)" }} />
          <div className="p-6 text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">🎉 You Won!</DialogTitle>
            </DialogHeader>
            <div className="py-5">
              <div className="text-6xl font-black my-3"
                style={{ background: "linear-gradient(135deg,#facc15,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {targetPrize.label}
              </div>
              <p className="text-white/50 text-sm">Added to your wallet</p>
              <p className="text-green-400 font-bold text-lg mt-1">+₹{targetPrize.value}</p>
            </div>
            <button
              onClick={() => setShowWinnerDialog(false)}
              className="w-full rounded-2xl h-12 font-bold text-[#080514] text-base active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#facc15,#f97316)" }}
            >
              Awesome! 🎉
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* All sheet dialogs */}
      <WithdrawalDialog  open={showWithdrawalDialog}  onOpenChange={setShowWithdrawalDialog} />
      <WithdrawalHistory open={showHistoryDialog}      onOpenChange={setShowHistoryDialog} />
      <ReferralSystem    open={showReferralDialog}     onOpenChange={setShowReferralDialog} />
      <DailyBonus        open={showDailyBonusDialog}   onOpenChange={setShowDailyBonusDialog} />
      <Support           open={showSupportDialog}      onOpenChange={setShowSupportDialog} />
      <TermsDialog       open={showTermsDialog}        onOpenChange={setShowTermsDialog} />

      <style jsx global>{`
        @keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
      `}</style>
    </>
  );
}

export default SpinWheel;