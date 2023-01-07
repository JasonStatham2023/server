import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Authorized } from '../decorators';
import { UserEntityType } from '../types';
import { CustomResponse, FileArgs } from '../models';
import { UserZoneInfo, Zone } from './models/zone.model';
import * as matter from 'gray-matter';
import {
  generateErrorResponse,
  generateSuccessResponse,
  getCurrentDayTimestamp,
} from '../utils';
import { JwtStrategy } from '../auth/jwt.strategy';

@Controller('zones')
export class ZonesController {
  constructor(readonly prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/userZoneInfo')
  async userZoneInfo(
    @Authorized() user: UserEntityType,
    @Query('zoneId') zoneId: number,
  ): Promise<CustomResponse<UserZoneInfo>> {
    const { toDayStartTimestamp } = getCurrentDayTimestamp();
    const sqlZone = await this.prisma.zone.findUnique({
      where: {
        id: zoneId,
      },
    });
    const freezeNumber = await this.prisma.orderRecord.count({
      where: {
        zoneId,
        userId: user.id,
        status: 1,
      },
    });

    const todayCompletionNumber = await this.prisma.orderRecord.count({
      where: {
        zoneId,
        userId: user.id,
        timestamp: {
          gt: toDayStartTimestamp,
        },
      },
    });

    return generateSuccessResponse('', {
      todayCompletionNumber: todayCompletionNumber,
      freezeNumber,
      allNumber: sqlZone.takes,
    });
  }

  @Post('/addZone')
  @UseGuards(JwtAuthGuard)
  async addZone(
    @Body()
    {
      title,
      probability,
      unitPrice,
      maxFreezesNum,
      shareProfit,
      takes,
      introduce,
      cover,
      award,
      gold,
    }: {
      title: string;
      probability: number;
      unitPrice: number;
      maxFreezesNum: number;
      shareProfit: number;
      takes: number;
      introduce: string;
      award: number;
      cover: FileArgs;
      gold: number;
    },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }

    const { content } = matter(introduce);

    await this.prisma.zone.create({
      data: {
        title,
        cover: {
          create: {
            url: cover.url,
            size: cover.size,
            md5FileName: cover.md5FileName,
            name: cover.name,
          },
        },
        maxFreezesNum,
        probability,
        unitPrice,
        shareProfit,
        takes,
        introduce,
        htmlIntroduce: content,
        award,
        gold,
      },
    });
    return generateSuccessResponse();
  }

  @UseGuards(JwtStrategy)
  @Get('/deleteZone')
  async deleteZone(
    @Query('id') id: number,
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    await this.prisma.zone.delete({
      where: {
        id,
      },
    });
    return generateSuccessResponse();
  }

  @Post('/updateZone')
  @UseGuards(JwtAuthGuard)
  async updateZone(
    @Body()
    {
      id,
      title,
      probability,
      unitPrice,
      maxFreezesNum,
      shareProfit,
      takes,
      introduce,
      cover,
      award,
      gold,
    }: {
      id: number;
      title: string;
      probability: number;
      unitPrice: number;
      maxFreezesNum: number;
      shareProfit: number;
      takes: number;
      introduce: string;
      award: number;
      cover: FileArgs;
      gold: number;
    },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    const { content } = matter(introduce);
    // 正则过滤html标签
    // const htmlIntroduce = content.replace(/<[^>]+>/g, '');
    // console.log(htmlIntroduce);
    await this.prisma.zone.update({
      where: {
        id,
      },
      data: {
        title,
        cover: {
          create: {
            url: cover.url,
            size: cover.size,
            md5FileName: cover.md5FileName,
            name: cover.name,
          },
        },
        maxFreezesNum,
        probability,
        unitPrice,
        shareProfit,
        takes,
        introduce: content,
        htmlIntroduce: content,
        award,
        gold,
      },
    });
    return generateSuccessResponse();
  }

  @Get('/zoneList')
  @UseGuards(JwtAuthGuard)
  async zoneList(
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse('80', 'you are not an administrator！');
    }
    const list = await this.prisma.zone.findMany({
      where: {},
      include: {
        cover: true,
      },
    });
    return generateSuccessResponse('', list);
  }

  @Get('/zone')
  @UseGuards(JwtAuthGuard)
  async zone(
    @Query('id') id: string,
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<Zone>> {
    const sqlZone = await this.prisma.zone.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        cover: true,
      },
    });
    return generateSuccessResponse('', sqlZone);
  }
}
