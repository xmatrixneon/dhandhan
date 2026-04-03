"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { IndianRupee, Wallet } from "lucide-react";

interface GameHeaderProps {
  onWithdrawClick: () => void;
  onHistoryClick: () => void;
}

export function GameHeader({ onWithdrawClick, onHistoryClick }: GameHeaderProps) {
  const { balance } = useWallet();

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-lg">
      <div className="flex items-center justify-between p-4">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">धना धन</h1>
            <p className="text-xs text-white/80">Spin & Win</p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-white/80">Balance</p>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4 text-yellow-300" />
              <span className="text-xl font-bold text-white">{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={onWithdrawClick}
            size="sm"
            className="bg-white text-purple-600 hover:bg-white/90 font-semibold text-xs h-8 px-3"
          >
            Withdraw
          </Button>
          <Button
            onClick={onHistoryClick}
            size="sm"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/10 font-semibold text-xs h-8 px-3"
          >
            History
          </Button>
        </div>
      </div>
    </Card>
  );
}
