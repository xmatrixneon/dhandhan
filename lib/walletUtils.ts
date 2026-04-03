import { WalletState, WithdrawalRequest } from "./withdrawalTypes";

const WALLET_STORAGE_KEY = "dhana_dhan_wallet";
const WITHDRAWALS_STORAGE_KEY = "dhana_dhan_withdrawals";
const SPIN_HISTORY_KEY = "dhana_dhan_spin_history";
const REFERRAL_DATA_KEY = "dhana_dhan_referral";
const DAILY_STREAK_KEY = "dhana_dhan_daily_streak";

// Initial balance - NO welcome bonus (starts at 0)
export const INITIAL_BALANCE = 0;
export const MAX_SPINS_PER_24H = 2;
export const SPIN_WINDOW_HOURS = 24;

// Daily streak bonus amounts
export const DAILY_BONUS_AMOUNTS = [20, 40, 60, 120];

interface SpinRecord {
  timestamp: number;
}

interface DailyStreakData {
  currentStreak: number;
  lastCheckInDate: string; // YYYY-MM-DD format
  totalCheckIns: number;
}

interface ReferralData {
  referralCode: string;
  referredBy?: string;
  totalReferrals: number;
}

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
 * Get spin history
 */
export function getSpinHistory(): SpinRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const history = localStorage.getItem(SPIN_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Save spin history
 */
export function saveSpinHistory(history: SpinRecord[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SPIN_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving spin history:", error);
  }
}

/**
 * Check if user can spin (2 spins per 24 hours)
 */
export function canSpin(): { canSpin: boolean; remainingSpins: number; nextSpinTime?: number } {
  const spinHistory = getSpinHistory();
  const now = Date.now();
  const windowMs = SPIN_WINDOW_HOURS * 60 * 60 * 1000;

  // Filter spins within the 24-hour window
  const recentSpins = spinHistory.filter(
    (spin) => now - spin.timestamp < windowMs
  );

  const remainingSpins = Math.max(0, MAX_SPINS_PER_24H - recentSpins.length);

  if (remainingSpins > 0) {
    return { canSpin: true, remainingSpins };
  }

  // Find when the oldest spin within the window will expire
  const oldestSpin = recentSpins[0];
  const nextSpinTime = oldestSpin.timestamp + windowMs;

  return { canSpin: false, remainingSpins: 0, nextSpinTime };
}

/**
 * Record a spin
 */
export function recordSpin(): void {
  const spinHistory = getSpinHistory();
  spinHistory.push({ timestamp: Date.now() });
  saveSpinHistory(spinHistory);
}

/**
 * Get referral data
 */
export function getReferralData(): ReferralData {
  if (typeof window === "undefined") {
    return {
      referralCode: generateReferralCode(),
      totalReferrals: 0,
    };
  }

  try {
    const data = localStorage.getItem(REFERRAL_DATA_KEY);
    if (data) {
      return JSON.parse(data);
    }

    // Create new referral data
    const newReferralData: ReferralData = {
      referralCode: generateReferralCode(),
      totalReferrals: 0,
    };
    localStorage.setItem(REFERRAL_DATA_KEY, JSON.stringify(newReferralData));
    return newReferralData;
  } catch (error) {
    return {
      referralCode: generateReferralCode(),
      totalReferrals: 0,
    };
  }
}

/**
 * Save referral data
 */
export function saveReferralData(data: ReferralData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(REFERRAL_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving referral data:", error);
  }
}

/**
 * Generate a random referral code
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Get referral stats
 */
export function getReferralStats(): { code: string; totalReferrals: number } {
  const data = getReferralData();
  return {
    code: data.referralCode,
    totalReferrals: data.totalReferrals,
  };
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
  localStorage.removeItem(SPIN_HISTORY_KEY);
  localStorage.removeItem(REFERRAL_DATA_KEY);
  localStorage.removeItem(DAILY_STREAK_KEY);
}

/**
 * Get daily streak data
 */
export function getDailyStreak(): DailyStreakData {
  if (typeof window === "undefined") {
    return { currentStreak: 0, lastCheckInDate: "", totalCheckIns: 0 };
  }

  try {
    const data = localStorage.getItem(DAILY_STREAK_KEY);
    return data ? JSON.parse(data) : { currentStreak: 0, lastCheckInDate: "", totalCheckIns: 0 };
  } catch (error) {
    return { currentStreak: 0, lastCheckInDate: "", totalCheckIns: 0 };
  }
}

/**
 * Save daily streak data
 */
export function saveDailyStreak(data: DailyStreakData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(DAILY_STREAK_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving daily streak:", error);
  }
}

/**
 * Check if user can claim daily bonus (once per day)
 */
export function canClaimDailyBonus(): { canClaim: boolean; bonusAmount?: number; currentStreak: number } {
  const streakData = getDailyStreak();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // Check if already claimed today
  if (streakData.lastCheckInDate === today) {
    return { canClaim: false, currentStreak: streakData.currentStreak };
  }

  // Check if streak is broken (missed yesterday)
  if (streakData.lastCheckInDate) {
    const lastDate = new Date(streakData.lastCheckInDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // If last check-in was before yesterday, reset streak
    if (lastDate < new Date(yesterday.toISOString().split("T")[0])) {
      return { canClaim: true, bonusAmount: DAILY_BONUS_AMOUNTS[0], currentStreak: 0 };
    }
  }

  // Calculate streak bonus (cycles through 20, 40, 60, 120)
  const streakIndex = streakData.currentStreak % DAILY_BONUS_AMOUNTS.length;
  const bonusAmount = DAILY_BONUS_AMOUNTS[streakIndex];

  return { canClaim: true, bonusAmount, currentStreak: streakData.currentStreak + 1 };
}

/**
 * Claim daily bonus
 */
export function claimDailyBonus(): { success: boolean; error?: string; bonusAmount?: number; newStreak?: number; newBalance?: number } {
  const checkResult = canClaimDailyBonus();

  if (!checkResult.canClaim) {
    return { success: false, error: "Already claimed today. Come back tomorrow!" };
  }

  // Add bonus to balance
  const bonusAmount = checkResult.bonusAmount || DAILY_BONUS_AMOUNTS[0];
  const newBalance = addToBalance(bonusAmount);

  // Update streak data
  const streakData: DailyStreakData = {
    currentStreak: checkResult.currentStreak,
    lastCheckInDate: new Date().toISOString().split("T")[0],
    totalCheckIns: getDailyStreak().totalCheckIns + 1,
  };
  saveDailyStreak(streakData);

  return { success: true, bonusAmount, newStreak: streakData.currentStreak, newBalance };
}

/**
 * Get daily bonus info for display
 */
export function getDailyBonusInfo(): { canClaim: boolean; nextBonusAmount: number; currentStreak: number; totalDays: number; tomorrowDate?: string } {
  const streakData = getDailyStreak();
  const today = new Date().toISOString().split("T")[0];

  const canClaimResult = canClaimDailyBonus();

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  return {
    canClaim: canClaimResult.canClaim,
    nextBonusAmount: canClaimResult.bonusAmount || DAILY_BONUS_AMOUNTS[streakData.currentStreak % DAILY_BONUS_AMOUNTS.length],
    currentStreak: streakData.currentStreak,
    totalDays: streakData.totalCheckIns,
    tomorrowDate,
  };
}
