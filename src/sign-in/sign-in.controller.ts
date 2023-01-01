import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Authorized } from '../decorators';
import { UserEntityType } from '../types';
import { PrismaService } from '../prisma.service';
import {
  generateErrorResponse,
  generateSuccessResponse,
  getTimestamp,
} from '../utils';
import { CustomResponse } from '../models';

type SignInReceiveRewardsType = {
  type: 0 | 1; // 0 是金钱 1 是金币
  quantity: number;
  isDone?: boolean;
};
const createSignInReceiveRewards = (): Record<
  number,
  SignInReceiveRewardsType
> => {
  return {
    1: {
      type: 0,
      quantity: 1,
      isDone: false,
    },
    2: {
      type: 0,
      quantity: 1,
      isDone: false,
    },
    3: {
      type: 0,
      quantity: 1,
      isDone: false,
    },
    4: {
      type: 0,
      quantity: 1,
      isDone: false,
    },
    5: {
      type: 0,
      quantity: 5,
      isDone: false,
    },
    6: {
      type: 0,
      quantity: 1,
      isDone: false,
    },
    7: {
      type: 0,
      quantity: 1,
      isDone: false,
    },
    8: {
      type: 0,
      quantity: 1,
      isDone: false,
    },
    9: {
      type: 0,
      quantity: 1,
      isDone: false,
    },
    10: {
      type: 1,
      quantity: 1,
      isDone: false,
    },
  };
};

@Controller('signIn')
export class SignInController {
  constructor(readonly prisma: PrismaService) {}

  @Post('/index')
  @UseGuards(JwtAuthGuard)
  async signIn(
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    const signInReceiveRewards = createSignInReceiveRewards();
    const { toDayStartTimestamp, toDayEndTimestamp, currentTimestamp } =
      getTimestamp();
    const isSignIn = await this.prisma.signInRecord.count({
      where: {
        userId: user.id,
        timestamp: {
          gt: toDayStartTimestamp,
          lt: toDayEndTimestamp,
        },
      },
    });
    if (isSignIn) {
      return generateErrorResponse(99, 'Signed in today！');
    }
    const count = await this.prisma.signInRecord.count({
      where: {
        userId: user.id,
      },
    });

    const index = count % 10;

    const day = index + 1;
    const receiveRewards = signInReceiveRewards[day];

    if (receiveRewards.type === 0) {
      // 送钱
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          balance: {
            increment: receiveRewards.quantity,
          },
        },
      });
    } else {
      // 送金币
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          gold: {
            increment: receiveRewards.quantity,
          },
        },
      });
    }
    await this.prisma.signInRecord.create({
      data: {
        timestamp: currentTimestamp,
        userId: user.id,
      },
    });
    return generateSuccessResponse('Successful check-in');
  }

  @Post('/info')
  @UseGuards(JwtAuthGuard)
  async checkSignIn(@Authorized() user: UserEntityType): Promise<
    CustomResponse<{
      isSignIn: boolean;
      signInReceiveRewards: SignInReceiveRewardsType;
    }>
  > {
    const signInReceiveRewards = createSignInReceiveRewards();
    const { toDayStartTimestamp, toDayEndTimestamp } = getTimestamp();

    const count = await this.prisma.signInRecord.count({
      where: {
        userId: user.id,
      },
    });

    const index = count % 10;

    for (let i = 1; i <= index; i++) {
      signInReceiveRewards[i].isDone = true;
    }
    const isSignIn = await this.prisma.signInRecord.count({
      where: {
        userId: user.id,
        timestamp: {
          gt: toDayStartTimestamp,
          lt: toDayEndTimestamp,
        },
      },
    });
    return generateSuccessResponse('', {
      isSignIn,
      signInReceiveRewards: Object.values(signInReceiveRewards),
    });
  }
}
