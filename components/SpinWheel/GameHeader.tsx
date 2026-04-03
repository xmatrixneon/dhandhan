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
    <Card className="bg-primary border-0 shadow-lg">
      <div className="flex items-center justify-between p-3">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="bg-primary-foreground/20 p-2 rounded-lg">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-primary-foreground">धना धन</h1>
            <p className="text-[10px] text-primary-foreground/80">Spin & Win</p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] text-primary-foreground/80">Balance</p>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-accent" />
              <span className="text-lg font-bold text-primary-foreground">{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1">
          <Button
            onClick={onDailyBonusClick}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-[10px] h-7 px-2"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Bonus
          </Button>
          <Button
            onClick={onReferClick}
            size="sm"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-[10px] h-7 px-2"
          >
            <Users className="h-3 w-3 mr-1" />
            Refer
          </Button>
          <Button
            onClick={onSupportClick}
            size="sm"
            className="bg-muted text-muted-foreground hover:bg-muted/90 font-semibold text-[10px] h-7 px-2"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Help
          </Button>
          <Button
            onClick={onWithdrawClick}
            size="sm"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-[10px] h-7 px-2"
          >
            Withdraw
          </Button>
        </div>
      </div>
    </Card>
  );
}
