"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { claimDailyBonus, getDailyBonusInfo, DAILY_BONUS_AMOUNTS } from "@/lib/walletUtils";
import { toast } from "sonner";
import { Calendar, Gift, CheckCircle2, Flame, TrendingUp, Clock } from "lucide-react";

interface DailyBonusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailyBonus({ open, onOpenChange }: DailyBonusProps) {
  const [bonusInfo, setBonusInfo] = useState(getDailyBonusInfo());
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (open) {
      setBonusInfo(getDailyBonusInfo());
    }
  }, [open]);

  const handleClaimBonus = async () => {
    if (!bonusInfo.canClaim) {
      toast.error("Already claimed today! Come back tomorrow.");
      return;
    }

    setIsClaiming(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = claimDailyBonus();

    if (result.success) {
      toast.success(`🎉 Daily bonus claimed! +₹${result.bonusAmount}`, {
        description: `Current streak: ${result.newStreak || 1} day${(result.newStreak || 1) > 1 ? "s" : ""}`,
        duration: 5000,
      });
      setBonusInfo(getDailyBonusInfo());
    } else {
      toast.error(result.error || "Failed to claim bonus");
    }

    setIsClaiming(false);
  };

  const getStreakEmoji = (days: number) => {
    if (days >= 30) return "🔥";
    if (days >= 14) return "⚡";
    if (days >= 7) return "💪";
    if (days >= 3) return "🌟";
    return "✨";
  };

  const getStreakColor = (days: number) => {
    if (days >= 30) return "text-red-600";
    if (days >= 14) return "text-orange-600";
    if (days >= 7) return "text-yellow-600";
    if (days >= 3) return "text-green-600";
    return "text-blue-600";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6" />
            Daily Bonus
          </SheetTitle>
          <SheetDescription className="text-center">
            Claim your daily reward and build your streak!
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 pb-4">
          {/* Current Streak Card */}
          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-4xl ${getStreakColor(bonusInfo.currentStreak)}`}>
                      {getStreakEmoji(bonusInfo.currentStreak)}
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                      {bonusInfo.currentStreak}
                    </span>
                    <span className="text-lg text-gray-600">day{bonusInfo.currentStreak !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <Flame className={`h-8 w-8 ${bonusInfo.currentStreak >= 7 ? "text-orange-500" : "text-gray-300"}`} />
              </div>
            </div>
          </Card>

          {/* Next Bonus Info */}
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">Next Bonus</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{bonusInfo.nextBonusAmount}
                  </p>
                </div>
                <Gift className="h-8 w-8 text-purple-600" />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {bonusInfo.canClaim ? (
                    <span className="text-green-600 font-semibold">Available now!</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Claim tomorrow
                    </span>
                  )}
                </div>
                <Badge variant={bonusInfo.canClaim ? "default" : "secondary"}>
                  Day {bonusInfo.currentStreak + 1}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Bonus Progression */}
          <Card>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Bonus Progression
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {DAILY_BONUS_AMOUNTS.map((amount, index) => {
                  const dayNumber = index + 1;
                  const isPast = dayNumber <= bonusInfo.currentStreak;
                  const isNext = dayNumber === bonusInfo.currentStreak + 1;

                  return (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg border-2 transition-all ${
                        isPast
                          ? "bg-green-50 border-green-300"
                          : isNext
                          ? "bg-purple-50 border-purple-300 ring-2 ring-purple-400"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">Day {dayNumber}</div>
                      <div className={`text-lg font-bold ${isPast ? "text-green-600" : isNext ? "text-purple-600" : "text-gray-400"}`}>
                        ₹{amount}
                      </div>
                      {isPast && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto mt-1" />
                      )}
                      {isNext && (
                        <div className="w-2 h-2 bg-purple-600 rounded-full mx-auto mt-1 animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">
                    {bonusInfo.totalDays}
                  </p>
                  <p className="text-xs text-gray-600">Total Days</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">
                    {bonusInfo.currentStreak}
                  </p>
                  <p className="text-xs text-gray-600">Best Streak</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Claim Button */}
          <Button
            onClick={handleClaimBonus}
            disabled={!bonusInfo.canClaim || isClaiming}
            className={`w-full h-14 text-lg font-bold transition-transform ${
              bonusInfo.canClaim
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isClaiming ? (
              "Claiming..."
            ) : bonusInfo.canClaim ? (
              <>
                <Gift className="h-5 w-5 mr-2" />
                Claim ₹{bonusInfo.nextBonusAmount}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Claimed Today
              </>
            )}
          </Button>

          {!bonusInfo.canClaim && (
            <p className="text-xs text-center text-gray-500">
              Come back tomorrow to continue your streak!
            </p>
          )}

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
            variant="outline"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
