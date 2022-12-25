import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Authorized } from '../decorators';
import { UserEntityType } from '../types';
import * as md5 from 'md5';
import { CustomResponse } from '../models';
import {
  aliyunSendEmail,
  generateErrorResponse,
  generateSuccessResponse,
} from '../utils';
import { WithdrawalRecord } from './models/withdrawal.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';

@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * 用户提现
   * */
  @Post('/userWithdrawal')
  @UseGuards(JwtAuthGuard)
  async userWithdrawal(
    @Body()
    {
      amount,
      walletPassword,
      account,
      type,
    }: {
      amount: number;
      walletPassword: string;
      account: string;
      type: number;
    },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    const sqlUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (sqlUser.walletPassword !== md5(walletPassword.trim())) {
      return generateErrorResponse(
        99,
        'The wallet password is incorrect, please re-enter!',
      );
    }

    if (sqlUser.balance.toNumber() < amount) {
      return generateErrorResponse(
        99,
        'Insufficient balance, unable to withdraw!',
      );
    }

    // 将余额转成提现余额
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        withdrawalAmount: {
          increment: amount,
        },
        balance: {
          decrement: amount,
        },
      },
    });

    await this.prisma.withdrawalRecord.create({
      data: {
        userId: user.id,
        type,
        amount,
        account,
        status: 0,
      },
    });
    await aliyunSendEmail('有人来提现了', 'ovblifeG@gmail.com');
    return generateSuccessResponse(
      'Withdrawal has been submitted, waiting for staff approval!',
    );
  }

  /*  用户提现列表 */
  @Post('/userWithdrawalRecords')
  @UseGuards(JwtAuthGuard)
  async userWithdrawalRecords(@Authorized() user: UserEntityType): Promise<
    CustomResponse<{
      withdrawalRecords: WithdrawalRecord[];
      walletAddress: string;
    }>
  > {
    const sqlWithdrawalRecord = await this.prisma.withdrawalRecord.findMany({
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
      withdrawalRecords: sqlWithdrawalRecord,
      walletAddress: sqlUser.walletAddress,
    });
  }

  /*
   * 提现列表
   * */
  @Post('/withdrawalList')
  @UseGuards(JwtAuthGuard)
  async withdrawalList(
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
        return await this.prisma.withdrawalRecord.findMany({
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
        return await this.prisma.withdrawalRecord.count({});
      },
    );
    return generateSuccessResponse('', result);
  }

  /*
   * 审批审核
   * */
  @Post('/withdrawalApproval')
  @UseGuards(JwtAuthGuard)
  async withdrawalApproval(
    @Body()
    {
      id,
      status,
      amount,
      transactionHash,
      failureReasons,
    }: {
      id: number;
      status: number;
      amount: number;
      transactionHash: string;
      failureReasons: string;
    },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    if (!user.isAdmin) {
      return generateErrorResponse(80, 'you are not an administrator！');
    }

    const withdrawalRecord = await this.prisma.withdrawalRecord.findFirst({
      where: { id },
      include: {
        user: true,
      },
    });

    if (withdrawalRecord.status !== 0) {
      return generateErrorResponse(99, '该提现已处理');
    }

    await this.prisma.withdrawalRecord.update({
      where: {
        id,
      },
      data: {
        status,
        transactionHash: transactionHash || '',
        failureReasons: failureReasons || '',
      },
    });

    if (withdrawalRecord && status === 1) {
      // 更新账号余额
      await this.prisma.user.update({
        where: {
          id: withdrawalRecord.user.id,
        },
        data: {
          withdrawalAmount: {
            decrement: amount,
          },
        },
      });
    } else if (withdrawalRecord && status === 2) {
      // 恢复余额
      await this.prisma.user.update({
        where: {
          id: withdrawalRecord.user.id,
        },
        data: {
          balance: {
            increment: amount,
          },
          withdrawalAmount: {
            decrement: amount,
          },
        },
      });
    }
    return generateSuccessResponse();
  }
}
