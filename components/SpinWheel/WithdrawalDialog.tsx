"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";
import { IndianRupee, Phone, Banknote, Clock, Ban, AlertCircle } from "lucide-react";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawalDialog({ open, onOpenChange }: WithdrawalDialogProps) {
  const { balance, requestWithdrawal } = useWallet();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate amount
    const withdrawalAmount = parseInt(amount, 10);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawalAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsProcessing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create withdrawal request
    const result = requestWithdrawal(phoneNumber, upiId, withdrawalAmount);

    if (result.success) {
      toast.success(`Withdrawal request of ₹${withdrawalAmount} submitted successfully!`, {
        description: "Your request is pending approval",
        duration: 5000,
      });
      // Reset form
      setPhoneNumber("");
      setUpiId("");
      setAmount("");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to submit withdrawal request");
    }

    setIsProcessing(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="text-2xl font-bold">Withdraw Funds</SheetTitle>
          <SheetDescription className="text-center">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-purple-600 pt-2">
              <IndianRupee className="h-5 w-5" />
              Available Balance: {balance.toLocaleString()}
            </div>
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              pattern="[0-9]{10}"
              required
              className="text-lg"
              maxLength={10}
            />
            <p className="text-xs text-gray-500">Enter your 10-digit mobile number</p>
          </div>

          {/* UPI ID */}
          <div className="space-y-2">
            <Label htmlFor="upi" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              UPI ID
            </Label>
            <Input
              id="upi"
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value.toLowerCase())}
              required
              className="text-lg"
            />
            <p className="text-xs text-gray-500">Enter your UPI ID (e.g., user@upi)</p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Amount to Withdraw
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={balance}
              required
              className="text-lg"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Min: ₹1</span>
              <span>Max: ₹{balance.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {[100, 500, 1000, 2000].map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                disabled={quickAmount > balance}
                className="flex-1 min-w-[70px]"
              >
                ₹{quickAmount}
              </Button>
            ))}
          </div>

          {/* Terms & Conditions */}
          <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Clock className="h-3 w-3 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700"><strong>Processing Time:</strong> 24-48 hours</p>
            </div>
            <div className="flex items-start gap-2">
              <Ban className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700"><strong>No App Required:</strong> Web-based game only</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-3 w-3 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700"><strong>Daily Play:</strong> Play daily to maintain streak</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isProcessing || !phoneNumber || !upiId || !amount}
          >
            {isProcessing ? "Processing..." : "Submit Withdrawal Request"}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Withdrawals are processed within 24-48 hours
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
}
