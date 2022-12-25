import { File } from '../../models/file.module';

export class Video {
  id: number;
  file: File;
  createdAt: string;
  updatedAt: string;
}
