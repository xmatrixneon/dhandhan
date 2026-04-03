"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { IndianRupee, Wallet, Users, Calendar, MessageCircle } from "lucide-react";

interface GameHeaderProps {
  onWithdrawClick: () => void;
  onHistoryClick: () => void;
  onReferClick: () => void;
  onDailyBonusClick: () => void;
  onSupportClick: () => void;
}

export function GameHeader({ onWithdrawClick, onHistoryClick, onReferClick, onDailyBonusClick, onSupportClick }: GameHeaderProps) {
  const { balance } = useWallet();

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-lg">
      <div className="flex items-center justify-between p-3">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">धना धन</h1>
            <p className="text-[10px] text-white/80">Spin & Win</p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] text-white/80">Balance</p>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-yellow-300" />
              <span className="text-lg font-bold text-white">{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1">
          <Button
            onClick={onDailyBonusClick}
            size="sm"
            className="bg-orange-400 text-orange-900 hover:bg-orange-300 font-semibold text-[10px] h-7 px-2"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Bonus
          </Button>
          <Button
            onClick={onReferClick}
            size="sm"
            className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-semibold text-[10px] h-7 px-2"
          >
            <Users className="h-3 w-3 mr-1" />
            Refer
          </Button>
          <Button
            onClick={onSupportClick}
            size="sm"
            className="bg-blue-400 text-blue-900 hover:bg-blue-300 font-semibold text-[10px] h-7 px-2"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Help
          </Button>
          <Button
            onClick={onWithdrawClick}
            size="sm"
            className="bg-white text-purple-600 hover:bg-white/90 font-semibold text-[10px] h-7 px-2"
          >
            Withdraw
          </Button>
        </div>
      </div>
    </Card>
  );
}
