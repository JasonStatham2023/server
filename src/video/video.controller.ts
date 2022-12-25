import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Authorized } from '../decorators';
import { UserEntityType } from '../types';
import { CustomResponse, FileArgs } from '../models';
import { Video } from './models/video.model';
import { generateErrorResponse, generateSuccessResponse } from '../utils';
import { PrismaService } from '../prisma.service';

@Controller('video')
export class VideoController {
  constructor(readonly prisma: PrismaService) {}

  @Post('/videoList')
  @UseGuards(JwtAuthGuard)
  async videoList(
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<Video[]>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    const sqlVideos = await this.prisma.videoFile.findMany({
      where: {},
      include: {
        file: true,
      },
    });
    return generateSuccessResponse('', sqlVideos);
  }

  @Post('/addVideo')
  @UseGuards(JwtAuthGuard)
  async addVideo(
    @Body() { file }: { file: FileArgs },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    await this.prisma.videoFile.create({
      data: {
        file: {
          create: {
            ...file,
          },
        },
      },
    });
    return generateSuccessResponse();
  }

  @Post('/deleteVideo')
  @UseGuards(JwtAuthGuard)
  async deleteVideo(
    @Body() { id }: { id: number },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    await this.prisma.videoFile.delete({
      where: {
        id,
      },
    });
    return generateSuccessResponse();
  }

  @Post('/updateVideo')
  @UseGuards(JwtAuthGuard)
  async updateVideo(
    @Body() { id, file }: { id: number; file: FileArgs },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    await this.prisma.videoFile.update({
      where: {
        id,
      },
      data: {
        file: {
          create: {
            ...file,
          },
        },
      },
    });
    return generateSuccessResponse();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/video')
  async video(
    @Body() { id }: { id: number },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<Video>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    const sqlVideo = await this.prisma.videoFile.findUnique({
      where: {
        id,
      },
      include: {
        file: true,
      },
    });
    return generateSuccessResponse('', { videoFile: sqlVideo });
  }

  @Post('/videos')
  async videos(): Promise<CustomResponse<Video[]>> {
    const videoFiles = await this.prisma.videoFile.findMany({
      where: {},
      include: {
        file: true,
      },
    });
    return generateSuccessResponse('', { videoFiles });
  }
}
