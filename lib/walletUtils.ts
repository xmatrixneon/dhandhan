import { WalletState, WithdrawalRequest } from "./withdrawalTypes";

const WALLET_STORAGE_KEY = "dhana_dhan_wallet";
const WITHDRAWALS_STORAGE_KEY = "dhana_dhan_withdrawals";

// Initial balance when user starts
export const INITIAL_BALANCE = 1000;

/**
 * Get wallet state from localStorage
 */
export function getWalletState(): WalletState {
  if (typeof window === "undefined") {
    return { balance: INITIAL_BALANCE, withdrawals: [] };
  }

  try {
    const balance = localStorage.getItem(WALLET_STORAGE_KEY);
    const withdrawals = localStorage.getItem(WITHDRAWALS_STORAGE_KEY);

    return {
      balance: balance ? parseInt(balance, 10) : INITIAL_BALANCE,
      withdrawals: withdrawals ? JSON.parse(withdrawals) : [],
    };
  } catch (error) {
    console.error("Error reading wallet state:", error);
    return { balance: INITIAL_BALANCE, withdrawals: [] };
  }
}

/**
 * Save balance to localStorage
 */
export function saveBalance(balance: number): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(WALLET_STORAGE_KEY, balance.toString());
  } catch (error) {
    console.error("Error saving balance:", error);
  }
}

/**
 * Save withdrawals to localStorage
 */
export function saveWithdrawals(withdrawals: WithdrawalRequest[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(WITHDRAWALS_STORAGE_KEY, JSON.stringify(withdrawals));
  } catch (error) {
    console.error("Error saving withdrawals:", error);
  }
}

/**
 * Add amount to balance
 */
export function addToBalance(amount: number): number {
  const state = getWalletState();
  const newBalance = state.balance + amount;
  saveBalance(newBalance);
  return newBalance;
}

/**
 * Deduct amount from balance
 */
export function deductFromBalance(amount: number): { success: boolean; newBalance?: number } {
  const state = getWalletState();

  if (state.balance < amount) {
    return { success: false };
  }

  const newBalance = state.balance - amount;
  saveBalance(newBalance);
  return { success: true, newBalance };
}

/**
 * Create a new withdrawal request
 */
export function createWithdrawalRequest(
  phoneNumber: string,
  upiId: string,
  amount: number
): { success: boolean; withdrawal?: WithdrawalRequest; error?: string } {
  // Validate amount
  if (amount <= 0) {
    return { success: false, error: "Amount must be greater than 0" };
  }

  // Check balance
  const state = getWalletState();
  if (state.balance < amount) {
    return { success: false, error: "Insufficient balance" };
  }

  // Validate phone number (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return { success: false, error: "Please enter a valid 10-digit phone number" };
  }

  // Validate UPI ID
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  if (!upiRegex.test(upiId)) {
    return { success: false, error: "Please enter a valid UPI ID (e.g., user@upi)" };
  }

  // Deduct from balance
  const deductionResult = deductFromBalance(amount);
  if (!deductionResult.success) {
    return { success: false, error: "Insufficient balance" };
  }

  // Create withdrawal request
  const withdrawal: WithdrawalRequest = {
    id: `WD${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    phoneNumber,
    upiId,
    amount,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // Save to localStorage
  const updatedWithdrawals = [...state.withdrawals, withdrawal];
  saveWithdrawals(updatedWithdrawals);

  return { success: true, withdrawal };
}

/**
 * Get all withdrawal requests
 */
export function getWithdrawals(): WithdrawalRequest[] {
  const state = getWalletState();
  return state.withdrawals;
}

/**
 * Update withdrawal status (admin function)
 */
export function updateWithdrawalStatus(
  withdrawalId: string,
  status: WithdrawalRequest["status"]
): boolean {
  const state = getWalletState();
  const withdrawal = state.withdrawals.find((w) => w.id === withdrawalId);

  if (!withdrawal) {
    return false;
  }

  const updatedWithdrawals = state.withdrawals.map((w) =>
    w.id === withdrawalId ? { ...w, status } : w
  );

  saveWithdrawals(updatedWithdrawals);
  return true;
}

/**
 * Reset wallet (for testing)
 */
export function resetWallet(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(WALLET_STORAGE_KEY);
  localStorage.removeItem(WITHDRAWALS_STORAGE_KEY);
}
