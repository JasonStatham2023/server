import { File } from '../../models/file.module';

export class UserZoneInfo {
  todayCompletionNumber: number;
  freezeNumber: number;
  allNumber: number;
}

export class Zone {
  id: string;
  title: string;
  cover: File;
  maxFreezesNum: number;
  probability: number;
  unitPrice: number;
  shareProfit: number;
  takes: number;
  award: number;
  gold: number;
  introduce: string;
  createdAt: string;
  updatedAt: string;
}
