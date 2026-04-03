export interface WithdrawalRequest {
  id: string;
  phoneNumber: string;
  upiId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "rejected";
  createdAt: string;
}

export interface WalletState {
  balance: number;
  withdrawals: WithdrawalRequest[];
}
