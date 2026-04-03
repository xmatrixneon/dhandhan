"use client";

import { useState } from "react";
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
import { GameHeader } from "./GameHeader";
import { WithdrawalDialog } from "./WithdrawalDialog";
import { WithdrawalHistory } from "./WithdrawalHistory";
import { PRIZES, TARGET_PRIZE_INDEX, WHEEL_SIZE, MIN_TAP_TARGET } from "@/lib/constants";
import { calculateTargetRotation, animateWheel } from "@/lib/wheelUtils";
import { useWallet } from "@/contexts/WalletContext";
import type { Prize } from "@/lib/constants";

export function SpinWheel() {
  const { balance, addWinnings } = useWallet();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const targetPrize = PRIZES[TARGET_PRIZE_INDEX];

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setCurrentPrize(null);
    setShowWinnerDialog(false);

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
        className="h-screen bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 flex flex-col p-3 safe-area-inset no-select no-tap-highlight overflow-hidden"
        style={{ overflow: isSpinning ? "hidden" : "auto" }}
      >
        {/* Header */}
        <div className="mb-2">
          <GameHeader
            onWithdrawClick={() => setShowWithdrawalDialog(true)}
            onHistoryClick={() => setShowHistoryDialog(true)}
          />
        </div>

        {/* Main Game Card */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-2 pt-3">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                धना धन
              </CardTitle>
              <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-xs text-gray-600">Spin & Win!</p>
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
                    className="text-purple-600 mx-auto"
                  >
                    <path
                      d="M12 4L12 20M12 20L8 16M12 20L16 16"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-[10px] text-center text-purple-600 font-semibold leading-tight">
                    Tap to Spin!
                  </p>
                </div>
              )}

              {/* Spin Button */}
              <Button
                onClick={handleSpin}
                disabled={isSpinning}
                size="lg"
                className="w-full h-11 text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 active:from-purple-700 active:to-pink-700 active:scale-95 transition-transform no-tap-highlight"
                style={{ minHeight: `${MIN_TAP_TARGET}px` }}
              >
                {isSpinning ? "🎰 Spinning..." : "🎲 Spin!"}
              </Button>

              {/* Current Prize Display */}
              {currentPrize && !showWinnerDialog && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">You won:</p>
                  <p className="text-2xl font-bold text-purple-600">{currentPrize.label}</p>
                </div>
              )}
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
            <div className="text-4xl font-bold text-purple-600 my-4">
              {targetPrize.label}
            </div>
            <p className="text-gray-600 mb-2">
              You&apos;ve won the {targetPrize.label} prize in Dhana Dhan!
            </p>
            <p className="text-green-600 font-semibold">
              +₹{targetPrize.value} added to your balance
            </p>
          </div>
          <Button
            onClick={() => setShowWinnerDialog(false)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
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
    </>
  );
}
