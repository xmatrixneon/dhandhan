"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWallet } from "@/contexts/WalletContext";
import { WithdrawalRequest } from "@/lib/withdrawalTypes";
import { IndianRupee, Clock, CheckCircle2, XCircle, Loader2, History } from "lucide-react";

interface WithdrawalHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawalHistory({ open, onOpenChange }: WithdrawalHistoryProps) {
  const { withdrawals, refreshWithdrawals } = useWallet();

  // Refresh withdrawals when dialog opens
  useEffect(() => {
    if (open) {
      refreshWithdrawals();
    }
  }, [open, refreshWithdrawals]);

  const getStatusIcon = (status: WithdrawalRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: WithdrawalRequest["status"]) => {
    const variants: Record<
      WithdrawalRequest["status"],
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      processing: "outline",
      completed: "default",
      rejected: "destructive",
    };

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <History className="h-6 w-6" />
            Withdrawal History
          </SheetTitle>
          <SheetDescription className="text-center">
            Track all your withdrawal requests
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[400px] pr-4">
          {withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No withdrawal history yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Your withdrawal requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawals
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((withdrawal) => (
                  <Card key={withdrawal.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(withdrawal.status)}
                        <div>
                          <p className="font-semibold text-sm">ID: {withdrawal.id}</p>
                          <p className="text-xs text-gray-500">{formatDate(withdrawal.createdAt)}</p>
                        </div>
                      </div>
                      {getStatusBadge(withdrawal.status)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-lg text-purple-600 flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {withdrawal.amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{withdrawal.phoneNumber}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">UPI ID:</span>
                        <span className="font-medium">{withdrawal.upiId}</span>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </ScrollArea>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
        >
          Close
        </Button>
      </SheetContent>
    </Sheet>
  );
}
