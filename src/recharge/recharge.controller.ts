import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserEntityType } from '../types';
import { Authorized } from '../decorators';
import { CustomResponse } from '../models';
import {
  aliyunSendEmail,
  generateErrorResponse,
  generateSuccessResponse,
} from '../utils';
import { RechargeRecord } from './models/recharge.model';

@Controller('recharge')
export class RechargeController {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * 用户充值
   * */
  @Post('/userRecharge')
  @UseGuards(JwtAuthGuard)
  async userRecharge(
    @Body()
    {
      transactionHash,
      amount,
      type,
    }: { transactionHash: string; amount: number; type: number },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    const sqlRechargeRecord = await this.prisma.rechargeRecord.findFirst({
      where: {
        userId: user.id,
        transactionHash,
      },
    });

    if (sqlRechargeRecord) {
      return generateErrorResponse(
        99,
        'The recharge submission is successful, please wait for the background approval!',
      );
    }

    await this.prisma.rechargeRecord.create({
      data: {
        userId: user.id,
        amount,
        type,
        transactionHash,
        status: 0,
      },
    });
    await aliyunSendEmail('有人来充值了', 'ovblifeG@gmail.com');
    return generateSuccessResponse(
      'The recharge submission is successful, please wait for the background approval!',
    );
  }

  @Post('/userRechargeRecords')
  @UseGuards(JwtAuthGuard)
  async userRechargeRecords(
    @Authorized() user: UserEntityType,
  ): Promise<
    CustomResponse<{ rechargeRecords: RechargeRecord[]; walletAddress: string }>
  > {
    const sqlRechargeRecords = await this.prisma.rechargeRecord.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const sqlUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    return generateSuccessResponse('', {
      rechargeRecords: sqlRechargeRecords,
      walletAddress: sqlUser.walletAddress,
    });
  }

  /*
   * 充值列表
   * */
  @Post('/rechargeList')
  @UseGuards(JwtAuthGuard)
  async rechargeList(
    @Body() { status }: { status: number },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    let where = {};

    if (status !== -1) {
      where = { status };
    }

    const result = await findManyCursorConnection(
      async () => {
        return await this.prisma.rechargeRecord.findMany({
          where,
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      },
      async () => {
        return await this.prisma.rechargeRecord.count({});
      },
    );
    return generateSuccessResponse('', result);
  }

  /*
   * 单条充值记录
   * */
  @Post('/rechargeRecord')
  @UseGuards(JwtAuthGuard)
  async rechargeRecord(
    @Body() { id }: { id: number },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<RechargeRecord>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }
    const rechargeRecord = await this.prisma.rechargeRecord.findFirst({
      where: {
        id,
      },
    });
    return generateSuccessResponse('', rechargeRecord);
  }

  /*
   * 充值审核
   * */
  @Post('/rechargeApproval')
  @UseGuards(JwtAuthGuard)
  async rechargeApproval(
    @Body()
    {
      id,
      status,
      amount,
      failureReasons,
    }: { id: number; status: number; amount: number; failureReasons: string },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }

    const rechargeRecord = await this.prisma.rechargeRecord.findFirst({
      where: { id },
      include: {
        user: true,
      },
    });

    if (rechargeRecord.status !== 0) {
      return generateErrorResponse(99, '该充值已处理');
    }

    await this.prisma.rechargeRecord.update({
      where: {
        id,
      },
      data: {
        status,
        failureReasons: failureReasons || '',
        specialAmount: rechargeRecord.amount.toNumber() === amount ? 0 : amount,
      },
    });
    if (rechargeRecord && status === 1) {
      // 更新账号余额
      await this.prisma.user.update({
        where: {
          id: rechargeRecord.user.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    }

    return generateSuccessResponse();
  }
}
