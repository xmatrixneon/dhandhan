"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  getReferralStats,
  generateReferralCode,
} from "@/lib/walletUtils";
import { toast } from "sonner";
import { Users, Share2, Copy, CheckCircle2, Gift } from "lucide-react";

interface ReferralSystemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralSystem({ open, onOpenChange }: ReferralSystemProps) {
  const [referralStats, setReferralStats] = useState(getReferralStats());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setReferralStats(getReferralStats());
    }
  }, [open]);

  const handleCopyCode = () => {
    const referralLink = `${window.location.origin}?ref=${referralStats.code}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral link copied!", {
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    const referralLink = `${window.location.origin}?ref=${referralStats.code}`;
    const shareText = `🎡 Spin the wheel and win big in Dhana Dhan! Use my referral code: ${referralStats.code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Dhana Dhan - Spin & Win!",
          text: shareText,
          url: referralLink,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyCode();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Refer & Earn
          </SheetTitle>
          <SheetDescription className="text-center">
            Share with friends & family to earn rewards!
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 pb-4">
          {/* Referral Code Section */}
          <Card>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-600" />
                Your Referral Code
              </h3>

              <div className="bg-gray-100 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <code className="text-xl font-bold text-purple-600 tracking-wider">
                    {referralStats.code}
                  </code>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleShare}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                  size="lg"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Section */}
          <Card>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <Users className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-600">
                    {referralStats.totalReferrals}
                  </p>
                  <p className="text-xs text-gray-600">Total Referrals</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Gift className="h-6 w-6 mx-auto mb-1 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">
                    Growing
                  </p>
                  <p className="text-xs text-gray-600">Earn Rewards</p>
                </div>
              </div>
            </div>
          </Card>

          {/* How it Works */}
          <Card>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3">How it Works</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    1
                  </div>
                  <p>Share your referral code with friends & family</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    2
                  </div>
                  <p>They sign up and play Dhana Dhan</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    3
                  </div>
                  <p>Build your network and grow together!</p>
                </div>
              </div>
            </div>
          </Card>

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
