"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";
import { Wallet, Phone, Banknote, IndianRupee } from "lucide-react";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK = [100, 500, 1000, 2000];

export function WithdrawalDialog({ open, onOpenChange }: WithdrawalDialogProps) {
  const { balance, requestWithdrawal } = useWallet();
  const [phone,  setPhone]  = useState("");
  const [upi,    setUpi]    = useState("");
  const [amount, setAmount] = useState("");
  const [busy,   setBusy]   = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Keyboard detection via visualViewport API ──────────────────────────────
  useEffect(() => {
    if (!open) return;

    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      const hidden = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardHeight(Math.max(0, hidden));
    };

    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
      setKeyboardHeight(0);
    };
  }, [open]);

  // Scroll focused input into view when keyboard opens
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleSubmit = async () => {
    const amt = parseInt(amount, 10);
    if (isNaN(amt) || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (amt > balance)           { toast.error("Insufficient balance");  return; }
    if (phone.length !== 10)     { toast.error("Enter a valid 10-digit phone number"); return; }
    if (!upi.includes("@"))      { toast.error("Enter a valid UPI ID"); return; }

    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    const result = requestWithdrawal(phone, upi, amt);
    if (result.success) {
      toast.success(`₹${amt} withdrawal submitted!`, { description: "Pending · processed in 24–48 hrs" });
      setPhone(""); setUpi(""); setAmount("");
      onOpenChange(false);
    } else {
      toast.error(result.error ?? "Request failed");
    }
    setBusy(false);
  };

  const canSubmit = phone.length === 10 && upi.includes("@") && Number(amount) > 0 && !busy;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="border-0 text-white p-0"
        style={{
          background: "#0d0620",
          // Lift sheet above keyboard
          marginBottom: keyboardHeight,
          transition: "margin-bottom 0.25s ease",
          borderRadius: "24px 24px 0 0",
          maxHeight: "92vh",
        }}
      >
        {/* Drag pill */}
        <div className="h-1 w-10 rounded-full bg-white/20 mx-auto mt-3 mb-1" />

        {/* Scrollable body — has horizontal padding so content never touches edges */}
        <div
          ref={scrollRef}
          className="overflow-y-auto overscroll-contain"
          style={{ maxHeight: "calc(92vh - 20px)" }}
        >
          <div className="px-5 pt-3 pb-8">

            {/* Header */}
            <SheetHeader className="mb-5">
              <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-yellow-400" />
                Withdraw Funds
              </SheetTitle>
              {/* Balance row */}
              <div
                className="flex items-center justify-between mt-3 px-4 py-3 rounded-2xl border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/60 text-sm font-medium">Available Balance</span>
                </div>
                <span className="text-yellow-400 font-black text-lg">
                  ₹{balance.toLocaleString("en-IN")}
                </span>
              </div>
            </SheetHeader>

            {/* Fields */}
            <div className="space-y-4">

              {/* Phone */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onFocus={handleFocus}
                  className="w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-white placeholder-white/25 outline-none border transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: phone.length === 10 ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.10)",
                  }}
                />
                {phone.length > 0 && phone.length < 10 && (
                  <p className="text-red-400/80 text-[11px] mt-1 ml-1">{10 - phone.length} more digits needed</p>
                )}
              </div>

              {/* UPI */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Banknote className="w-3.5 h-3.5" /> UPI ID
                </label>
                <input
                  type="email"
                  inputMode="email"
                  placeholder="yourname@upi"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value.toLowerCase())}
                  onFocus={handleFocus}
                  className="w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-white placeholder-white/25 outline-none border transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: upi.includes("@") ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.10)",
                  }}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5" /> Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-base pointer-events-none">₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={handleFocus}
                    min={1}
                    max={balance}
                    className="w-full rounded-2xl pl-8 pr-4 py-3.5 text-sm font-medium text-white placeholder-white/25 outline-none border transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: Number(amount) > 0 && Number(amount) <= balance
                        ? "rgba(52,211,153,0.5)"
                        : Number(amount) > balance
                        ? "rgba(248,113,113,0.6)"
                        : "rgba(255,255,255,0.10)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/30 mt-1 px-1">
                  <span>Min ₹1</span>
                  <span>Max ₹{balance.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(q.toString())}
                    disabled={q > balance}
                    className="rounded-xl py-2.5 text-xs font-bold border transition-all active:scale-95"
                    style={{
                      background: amount === String(q)
                        ? "rgba(250,204,21,0.15)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: amount === String(q)
                        ? "rgba(250,204,21,0.5)"
                        : "rgba(255,255,255,0.10)",
                      color: q > balance
                        ? "rgba(255,255,255,0.18)"
                        : amount === String(q)
                        ? "#facc15"
                        : "rgba(255,255,255,0.55)",
                      cursor: q > balance ? "not-allowed" : "pointer",
                    }}
                  >
                    ₹{q}
                  </button>
                ))}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  height: 52,
                  marginTop: 8,
                  background: canSubmit
                    ? "linear-gradient(135deg,#facc15,#f97316)"
                    : "rgba(255,255,255,0.07)",
                  color: canSubmit ? "#080514" : "rgba(255,255,255,0.28)",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  boxShadow: canSubmit ? "0 6px 24px rgba(250,204,21,0.35)" : "none",
                }}
              >
                {busy ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full inline-block"
                      style={{ animation: "spin 0.7s linear infinite" }}
                    />
                    Processing…
                  </>
                ) : (
                  "Submit Withdrawal"
                )}
              </button>

              <p className="text-center text-white/25 text-xs">
                Processed to your UPI in 24–48 hours
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}