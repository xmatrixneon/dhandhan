"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getReferralStats } from "@/lib/walletUtils";
import { toast } from "sonner";
import { Users, Share2, Copy, CheckCircle2, Gift, Link2 } from "lucide-react";

interface ReferralSystemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralSystem({ open, onOpenChange }: ReferralSystemProps) {
  const [stats,  setStats]  = useState(getReferralStats);
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (open) setStats(getReferralStats()); }, [open]);

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}?ref=${stats.code}`
      : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Dhana Dhan – Spin & Win!",
          text: `🎡 Use my code ${stats.code} and win big!`,
          url: referralLink,
        });
      } catch { /* cancelled */ }
    } else {
      handleCopy();
    }
  };

  const steps = [
    { emoji: "🔗", text: "Share your referral link with friends & family" },
    { emoji: "📲", text: "They sign up and play Dhana Dhan" },
    { emoji: "🎁", text: "Build your network and earn together!" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="border-0 text-white p-0"
        style={{
          background: "#0d0620",
          borderRadius: "24px 24px 0 0",
          maxHeight: "90vh",
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
              <Users className="w-5 h-5 text-yellow-400" />
              Refer &amp; Earn
            </SheetTitle>
            <p className="text-white/40 text-sm mt-1">
              Invite friends to grow your rewards
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

          {/* Referral code card */}
          <div
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            {/* Gradient strip */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899)" }}
            />
            <div className="px-4 py-4">
              <p className="text-white/45 text-xs font-semibold uppercase tracking-wider mb-3">
                Your Referral Code
              </p>

              {/* Code + copy */}
              <div className="flex items-center justify-between gap-3">
                <code
                  className="text-3xl font-black tracking-[0.18em]"
                  style={{ color: "#facc15" }}
                >
                  {stats.code}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 shrink-0"
                  style={{
                    background: copied ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.07)",
                    borderColor: copied ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.15)",
                    color: copied ? "#34d399" : "rgba(255,255,255,0.7)",
                  }}
                >
                  {copied
                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</>
                    : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>

              {/* Link preview */}
              <div
                className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl border border-white/8"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <Link2 className="w-3.5 h-3.5 text-white/30 shrink-0" />
                <p className="text-white/35 text-[11px] truncate">{referralLink}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4 text-center border border-white/8"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: "linear-gradient(135deg,#facc15,#f97316)" }}
              >
                <Users className="w-5 h-5 text-[#080514]" />
              </div>
              <p className="text-2xl font-black text-white">{stats.totalReferrals}</p>
              <p className="text-white/40 text-xs mt-0.5">Referrals</p>
            </div>
            <div
              className="rounded-2xl p-4 text-center border border-white/8"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
              >
                <Gift className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-black text-white">Growing</p>
              <p className="text-white/40 text-xs mt-0.5">Network</p>
            </div>
          </div>

          {/* How it works */}
          <div
            className="rounded-2xl border border-white/8 px-4 py-4 space-y-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">
              How it works
            </p>
            {steps.map(({ emoji, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  {emoji}
                </div>
                <p className="text-white/55 text-sm leading-snug pt-1">{text}</p>
              </div>
            ))}
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-full rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{
              height: 52,
              background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
              color: "#fff",
              boxShadow: "0 6px 24px rgba(139,92,246,0.35)",
            }}
          >
            <Share2 className="w-5 h-5" />
            Share My Link
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}