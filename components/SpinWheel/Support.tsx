"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageCircle, Mail, AlertCircle, Clock, Gamepad2, Ban } from "lucide-react";

interface SupportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Support({ open, onOpenChange }: SupportProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Help & Support
          </SheetTitle>
          <SheetDescription className="text-center">
            Get help with Dhana Dhan
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 pb-4">
          {/* Contact Options */}
          <Card>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3">Contact Us</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => window.open("mailto:support@dhanadhan.com", "_blank")}
                >
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold">Email Support</div>
                    <div className="text-xs text-gray-500">support@dhanadhan.com</div>
                  </div>
                </Button>
              </div>
            </div>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Terms & Conditions
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Ban className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">No App Installation Required</p>
                    <p className="text-xs text-gray-600">This is a web-based game. No app download or installation needed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Withdrawal Processing Time</p>
                    <p className="text-xs text-gray-600">All withdrawal requests are processed within 24-48 hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Gamepad2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Daily Play Required</p>
                    <p className="text-xs text-gray-600">You must play daily to maintain your streak and maximize bonuses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Fair Play</p>
                    <p className="text-xs text-gray-600">Any attempt to manipulate or exploit the game will result in account suspension.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Spin Limits</p>
                    <p className="text-xs text-gray-600">Limited to 2 spins per 24 hours. Additional spins reset after 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-3">Frequently Asked Questions</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">How do I withdraw my winnings?</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Click the Withdraw button and enter your phone number, UPI ID, and amount. Minimum withdrawal is ₹1.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">How long does withdrawal take?</p>
                  <p className="text-xs text-gray-600 mt-1">
                    All withdrawals are processed within 24-48 hours.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">What happens if I miss a day?</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your daily streak will reset. To maximize bonuses, play every day!
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">How do I earn more?</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Spin daily, claim your daily bonus, and refer friends to build your network!
                  </p>
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
