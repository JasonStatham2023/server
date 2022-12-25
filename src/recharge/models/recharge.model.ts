export class RechargeUser {
  id: number;
  account: string;
  email: string;
  isAdmin: boolean;
  balance: number;
  walletAddress: string;
  accountFrozen: number;
  inviterId: number;
  inviterCode: number;
  gold: number;
  createdAt: string;
  updatedAt: string;
}

export class RechargeRecord {
  id: number;
  type: number;
  transactionHash: string;
  amount: number;
  specialAmount: number;
  status: number;
  failureReasons?: string;
  user: RechargeUser;
  createdAt: string;
  updatedAt: string;
}

export class Recharge {
  walletAddress: string;
  rechargeRecords: RechargeRecord[];
}
