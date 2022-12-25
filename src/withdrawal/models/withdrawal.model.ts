export class WithdrawalUser {
  id: number;
  account: string;
  email: string;
  isAdmin: boolean;
  balance: number;
  walletAddress: string;
  accountFrozen: number;
  withdrawalAmount: number;
  inviterId: number;
  inviterCode: number;
  gold: number;
  createdAt: string;
  updatedAt: string;
}

export class WithdrawalRecord {
  id: number;
  type: number;
  transactionHash: string;
  amount: number;
  specialAmount: number;
  status: number;
  account: string;
  failureReasons?: string;
  user: WithdrawalUser;
  createdAt: string;
  updatedAt: string;
}

export class Withdrawal {
  walletAddress: string;
  withdrawalRecords: WithdrawalRecord[];
}
