"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SpinWheelCanvas } from "./SpinWheelCanvas";
import { WheelPointer } from "./WheelPointer";
import { Confetti } from "./Confetti";
import { UnifiedTicker } from "./UnifiedTicker";
import { GameHeader } from "./GameHeader";
import { WithdrawalDialog } from "./WithdrawalDialog";
import { WithdrawalHistory } from "./WithdrawalHistory";
import { ReferralSystem } from "./ReferralSystem";
import { DailyBonus } from "./DailyBonus";
import { Support } from "./Support";
import { TermsDialog } from "./TermsDialog";
import { PRIZES, TARGET_PRIZE_INDEX, WHEEL_SIZE, MIN_TAP_TARGET } from "@/lib/constants";
import { calculateTargetRotation, animateWheel } from "@/lib/wheelUtils";
import { canSpin, recordSpin } from "@/lib/walletUtils";
import { useWallet } from "@/contexts/WalletContext";
import type { Prize } from "@/lib/constants";
import { Clock, Users } from "lucide-react";

export function SpinWheel() {
  const { balance, addWinnings } = useWallet();
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

  // Update spin status every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSpinStatus(canSpin());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;

    // Check spin limits
    const spinCheck = canSpin();
    if (!spinCheck.canSpin) {
      if (spinCheck.nextSpinTime) {
        const hours = Math.ceil((spinCheck.nextSpinTime - Date.now()) / (1000 * 60 * 60));
        toast.error(`Come back in ${hours} hour${hours > 1 ? "s" : ""}!`, {
          description: `You've used your 2 spins for today`,
        });
      }
      return;
    }

    setIsSpinning(true);
    setCurrentPrize(null);
    setShowWinnerDialog(false);

    // Record the spin
    recordSpin();

    // Calculate the rigged rotation to always land on ₹500
    const targetRotation = calculateTargetRotation();
    const startTime = performance.now();

    // Animate the wheel
    animateWheel(
      startTime,
      targetRotation,
      (currentRotation) => {
        setRotation(currentRotation);
      },
      () => {
        // Animation complete - show winner
        setIsSpinning(false);
        setCurrentPrize(targetPrize);
        setShowWinnerDialog(true);

        // Add winnings to balance
        addWinnings(targetPrize.value);

        // Update spin status
        setSpinStatus(canSpin());

        // Show toast notification
        toast.success(`🎉 You won ${targetPrize.label}!`, {
          description: `+₹${targetPrize.value} added to your balance`,
          duration: 5000,
          position: "top-center",
        });
      }
    );
  };

  return (
    <>
      <Confetti active={showWinnerDialog} />
      <div
        className="h-screen bg-gradient-to-b from-primary via-primary to-accent flex flex-col p-3 safe-area-inset no-select no-tap-highlight overflow-hidden"
        style={{ overflow: isSpinning ? "hidden" : "auto" }}
      >
        {/* Header */}
        <div className="mb-2">
          <GameHeader
            onWithdrawClick={() => setShowWithdrawalDialog(true)}
            onHistoryClick={() => setShowHistoryDialog(true)}
            onReferClick={() => setShowReferralDialog(true)}
            onDailyBonusClick={() => setShowDailyBonusDialog(true)}
            onSupportClick={() => setShowSupportDialog(true)}
          />
        </div>

        {/* Unified Activity Ticker */}
        <div className="mb-2 flex justify-center">
          <UnifiedTicker />
        </div>

        {/* Main Game Card */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-2 pt-3">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                धना धन
              </CardTitle>
              <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">Spin & Win!</p>
                <Badge variant="secondary" className="text-xs py-0">
                  Max: ₹5000
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-2 pb-3">
              {/* Wheel Container */}
              <div className="relative flex items-center justify-center">
                <WheelPointer />
                <SpinWheelCanvas
                  prizes={PRIZES}
                  rotation={rotation}
                  size={WHEEL_SIZE}
                />
              </div>

              {/* Arrow Indicator */}
              {!isSpinning && (
                <div className="animate-bounce">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-primary mx-auto"
                  >
                    <path
                      d="M12 4L12 20M12 20L8 16M12 20L16 16"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-[10px] text-center text-primary font-semibold leading-tight">
                    Tap to Spin!
                  </p>
                </div>
              )}

              {/* Spin Limit Indicator */}
              <div className="text-center">
                {spinStatus.canSpin ? (
                  <div className="flex items-center justify-center gap-1 text-xs text-primary font-semibold">
                    <span>{spinStatus.remainingSpins}/2 spins left</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-xs text-accent-foreground font-semibold">
                    <Clock className="h-3 w-3" />
                    <span>
                      {spinStatus.nextSpinTime && (
                        <>
                          {Math.ceil((spinStatus.nextSpinTime - Date.now()) / (1000 * 60 * 60))}h left
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Spin Button */}
              <Button
                onClick={handleSpin}
                disabled={isSpinning || !spinStatus.canSpin}
                size="lg"
                className={`w-full h-11 text-base font-bold transition-transform no-tap-highlight ${
                  spinStatus.canSpin
                    ? "bg-primary text-primary-foreground active:bg-primary/90 active:scale-95"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                style={{ minHeight: `${MIN_TAP_TARGET}px` }}
              >
                {isSpinning ? "🎰 Spinning..." : !spinStatus.canSpin ? "⏰ Limit Reached" : "🎲 Spin!"}
              </Button>

              {/* Current Prize Display */}
              {currentPrize && !showWinnerDialog && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">You won:</p>
                  <p className="text-2xl font-bold text-primary">{currentPrize.label}</p>
                </div>
              )}

              {/* Terms Link */}
              <button
                onClick={() => setShowTermsDialog(true)}
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                Terms & Conditions
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Winner Dialog */}
      <Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">🎉 Congratulations! 🎉</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-primary my-4">
              {targetPrize.label}
            </div>
            <p className="text-muted-foreground mb-2">
              You&apos;ve won the {targetPrize.label} prize in Dhana Dhan!
            </p>
            <p className="text-green-600 font-semibold">
              +₹{targetPrize.value} added to your balance
            </p>
          </div>
          <Button
            onClick={() => setShowWinnerDialog(false)}
            className="w-full bg-primary text-primary-foreground"
            size="lg"
          >
            Awesome! 🎉
          </Button>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Dialog */}
      <WithdrawalDialog
        open={showWithdrawalDialog}
        onOpenChange={setShowWithdrawalDialog}
      />

      {/* Withdrawal History Dialog */}
      <WithdrawalHistory
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
      />

      {/* Referral System Dialog */}
      <ReferralSystem
        open={showReferralDialog}
        onOpenChange={setShowReferralDialog}
      />

      {/* Daily Bonus Dialog */}
      <DailyBonus
        open={showDailyBonusDialog}
        onOpenChange={setShowDailyBonusDialog}
      />

      {/* Support Dialog */}
      <Support
        open={showSupportDialog}
        onOpenChange={setShowSupportDialog}
      />

      {/* Terms Dialog */}
      <TermsDialog
        open={showTermsDialog}
        onOpenChange={setShowTermsDialog}
      />
    </>
  );
}
