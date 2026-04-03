"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { WithdrawalRequest } from "@/lib/withdrawalTypes";
import {
  getWalletState,
  addToBalance,
  createWithdrawalRequest,
  getWithdrawals,
  resetWallet as resetWalletUtil,
} from "@/lib/walletUtils";

interface WalletContextType {
  balance: number;
  withdrawals: WithdrawalRequest[];
  addWinnings: (amount: number) => void;
  requestWithdrawal: (phoneNumber: string, upiId: string, amount: number) => { success: boolean; error?: string };
  refreshWithdrawals: () => void;
  resetWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  // Load wallet state on mount
  useEffect(() => {
    const state = getWalletState();
    setBalance(state.balance);
    setWithdrawals(state.withdrawals);
  }, []);

  const addWinnings = useCallback((amount: number) => {
    const newBalance = addToBalance(amount);
    setBalance(newBalance);
  }, []);

  const refreshWithdrawals = useCallback(() => {
    const allWithdrawals = getWithdrawals();
    setWithdrawals(allWithdrawals);
  }, []);

  const requestWithdrawal = useCallback((phoneNumber: string, upiId: string, amount: number) => {
    const result = createWithdrawalRequest(phoneNumber, upiId, amount);

    if (result.success) {
      // Update balance
      setBalance((prev) => prev - amount);
      // Refresh withdrawals directly
      const allWithdrawals = getWithdrawals();
      setWithdrawals(allWithdrawals);
    }

    return result;
  }, []);

  const resetWallet = useCallback(() => {
    resetWalletUtil();
    const state = getWalletState();
    setBalance(state.balance);
    setWithdrawals(state.withdrawals);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        balance,
        withdrawals,
        addWinnings,
        requestWithdrawal,
        refreshWithdrawals,
        resetWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
