import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as md5 from 'md5';
import * as fs from 'fs';
import * as path from 'path';
import { CustomResponse } from '../models';
import { generateSuccessResponse } from '../utils';

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CustomResponse<{ url: string }>> {
    const outPath = path.join(__dirname, '../../public/static');
    const [name, ext] = file.originalname.split('.');
    const filename = `${md5(name + '-' + new Date().getTime())}.${ext}`;
    const stream = fs.createWriteStream(path.join(outPath, filename));
    stream.write(file.buffer);
    return generateSuccessResponse('', {
      url: '/static/' + filename,
    });
  }
}
