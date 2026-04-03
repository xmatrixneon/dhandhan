"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Clock, Smartphone, Gamepad2, AlertCircle, Shield } from "lucide-react";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-600" />
            Terms & Conditions
          </DialogTitle>
          <DialogDescription>
            Please read our terms carefully before playing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* App Installation */}
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <Smartphone className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900">App Installation</h3>
              <p className="text-sm text-gray-600 mt-1">
                Download and install the Dhana Dhan app from official app stores only. We are not responsible for apps downloaded from unauthorized sources.
              </p>
            </div>
          </div>

          {/* Withdrawal Processing */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900">Withdrawal Processing Time</h3>
              <p className="text-sm text-gray-600 mt-1">
                All withdrawal requests are processed within <strong>24-48 hours</strong>. Please allow this time for processing.
              </p>
            </div>
          </div>

          {/* Daily Play Required */}
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <Gamepad2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900">Daily Play Required</h3>
              <p className="text-sm text-gray-600 mt-1">
                You must play daily to maintain your streak bonus. Missing a day will reset your streak. Daily bonuses are available every 24 hours.
              </p>
            </div>
          </div>

          {/* Spin Limits */}
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900">Spin Limits</h3>
              <p className="text-sm text-gray-600 mt-1">
                Limited to <strong>2 spins per 24 hours</strong>. Additional spins become available after the 24-hour window expires.
              </p>
            </div>
          </div>

          {/* Fair Play */}
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <Shield className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900">Fair Play Policy</h3>
              <p className="text-sm text-gray-600 mt-1">
                Any attempt to manipulate, exploit, or cheat the game will result in immediate account suspension and forfeiture of all winnings.
              </p>
            </div>
          </div>

          {/* Account Responsibility */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900">Account Responsibility</h3>
              <p className="text-sm text-gray-600 mt-1">
                You are responsible for maintaining the confidentiality of your account. All activities under your account are your responsibility.
              </p>
            </div>
          </div>

          {/* Withdrawal Terms */}
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
            <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900">Withdrawal Terms</h3>
              <p className="text-sm text-gray-600 mt-1">
                Minimum withdrawal amount is ₹1. Ensure your UPI ID and phone number are correct. We are not responsible for incorrect details provided.
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2">
            <p>By playing Dhana Dhan, you agree to these terms.</p>
            <p className="mt-1">Last updated: April 2026</p>
          </div>
        </div>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
        >
          I Understand
        </Button>
      </DialogContent>
    </Dialog>
  );
}
