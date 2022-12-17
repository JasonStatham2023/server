import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';
import * as md5 from 'md5';
import {
  aliyunSendEmail,
  generateErrorResponse,
  generateSuccessResponse,
  getTimestamp,
} from '../utils';
import { INVITE_BASE_NUMBER, WEB_HOST } from '../constant';
import { CustomResponse } from '../models';
import { UserEntityType } from '../types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Authorized } from '../decorators';
import { JwtStrategy } from '../auth/jwt.strategy';

const MAX_SEND_MSG_NUMBER = 10;

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  createAuthCode(n: number): string {
    let code = '';

    for (let i = 0; i < n; i += 1) {
      code += Math.floor(Math.random() * 10).toString();
    }

    return code;
  }

  @Post('/login')
  async login(
    @Body() user: { account: string; password: string },
  ): Promise<CustomResponse<any>> {
    if (typeof user.account !== 'string' || typeof user.password !== 'string') {
      return generateErrorResponse(
        99,
        'The account number or password is incorrect!',
      );
    }
    const { account, password } = user;
    const sqlUser = await this.prisma.user.findUnique({
      where: {
        account,
      },
    });

    if (!sqlUser) {
      return generateErrorResponse(
        99,
        'The account number or password is incorrect!',
      );
    }

    if (!sqlUser.isActive) {
      return generateErrorResponse(
        91,
        'The account has not been activated, please click the activation link to the mailbox bound to the account!',
      );
    }

    const { isAdmin, id, email, password: sqlPassword } = sqlUser;

    if (md5(password) === sqlPassword) {
      const timestamp = (new Date().getTime() / 1000) | 0;
      const { access_token } = await this.authService.login({
        account,
        email,
        isAdmin: isAdmin,
        id: id,
        timestamp,
      });
      await this.prisma.user.update({
        where: {
          account,
        },
        data: {
          token: access_token,
          timestamp,
        },
      });
      return generateSuccessResponse('', {
        token: access_token,
      });
    } else {
      return generateErrorResponse(
        99,
        'Password is incorrect, please re-enter！',
      );
    }
  }

  /**
   * 注册
   * @param user
   */
  @Post('/register')
  async register(
    @Body()
    user: {
      account: string;
      password: string;
      email: string;
      inviteCode: number;
    },
  ): Promise<CustomResponse<any>> {
    const { account, password, email, inviteCode } = user;
    if (!account || !password || !email) {
      return generateErrorResponse(99, 'wrong parameter');
    }
    // 判断用户名是否存在
    const userByAccount = await this.prisma.user.findFirst({
      where: {
        account,
      },
    });

    if (userByAccount && userByAccount.isActive) {
      return generateErrorResponse(
        99,
        'Account name already exists, please re-enter!',
      );
    }
    // 判断 邮箱是否存在
    const userByEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    const inviterUserId = inviteCode
      ? Number(inviteCode) - INVITE_BASE_NUMBER
      : 0;

    if (inviterUserId !== 0) {
      const sqlInviterUser = await this.prisma.user.findUnique({
        where: {
          id: inviterUserId,
        },
      });
      if (!sqlInviterUser) {
        return generateErrorResponse(
          99,
          'The invited user does not exist, please check your invitation code!',
        );
      }
    }

    if (
      (userByEmail && userByEmail.isActive) ||
      (userByAccount && userByAccount.isActive)
    ) {
      return generateErrorResponse(
        99,
        'The changed email address has been bound to another account, please enter another email address!',
      );
    } else {
      if (userByAccount) {
        await this.prisma.user.delete({
          where: {
            account: userByAccount.account,
          },
        });
        const count = await this.prisma.inviteEarningsRecord.count({
          where: {
            inviteeId: userByAccount.id,
          },
        });
        if (count > 0) {
          // 这条记录存在，可以执行删除操作
          await this.prisma.inviteEarningsRecord.delete({
            where: {
              inviteeId: userByAccount.id,
            },
          });
        } else {
          // 这条记录不存在，不需要执行删除操作
        }
      }
      // 则更新信息
      if (userByEmail) {
        try {
          await this.prisma.user.delete({
            where: {
              id: userByEmail.id,
            },
          });
        } catch (e) {}
        try {
          await this.prisma.inviteEarningsRecord.delete({
            where: {
              inviteeId: userByEmail.id,
            },
          });
        } catch (e) {}
      }
      const { id } = await this.prisma.user.create({
        data: {
          email,
          account,
          walletAddress: '',
          password: md5(password),
        },
      });
      // 更新自己邀请码 邀请人
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          inviterId: inviterUserId,
          inviterCode: id + INVITE_BASE_NUMBER,
        },
      });

      if (inviterUserId !== 0) {
        await this.prisma.inviteEarningsRecord.create({
          data: {
            inviteeId: id,
            account,
            userId: inviterUserId,
          },
        });
      }

      const result = await this.sendEmailLink(email, 1);

      if (result.code !== 100) {
        return result;
      }

      return generateSuccessResponse('registration success！');
    }
  }

  async sendEmailLink(email: string, type): Promise<CustomResponse<any>> {
    const authCode = this.createAuthCode(6);
    const { currentTimestamp, toDayStartTimestamp } = getTimestamp();
    const profiles = await this.prisma.userProfile.findMany({
      where: {
        email,
        timestamp: {
          gt: toDayStartTimestamp,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // 设置时间间隔 60S
    if (profiles[0]?.createdAt) {
      const timestamp = new Date(profiles[0].createdAt).getTime();
      const finalTimestamp = new Date().getTime();
      if (finalTimestamp - timestamp < 60 * 1000) {
        return generateErrorResponse(99, 'Please try again after 60 seconds');
      }
    }

    if (profiles.length >= MAX_SEND_MSG_NUMBER) {
      return generateErrorResponse(
        99,
        `1 day can only be sent${MAX_SEND_MSG_NUMBER}`,
      );
    }
    await this.prisma.userProfile.create({
      data: {
        email,
        authCode,
        timestamp: currentTimestamp,
      },
    });
    let sendContent = '';

    switch (type) {
      case 1:
        sendContent = `Hello, dear user, please click this link to activate your ovb account![<a href="${WEB_HOST}/activate-account?email=${encodeURIComponent(
          email,
        )}&authCode=${authCode}">${WEB_HOST}/activate-account?email=${encodeURIComponent(
          email,
        )}&authCode=${authCode}</a>]`;
        break;
      case 2:
        sendContent = `Hello, please click this link to reset your login password![<a href="${WEB_HOST}/password-reset?email=${encodeURIComponent(
          email,
        )}&authCode=${authCode}">${WEB_HOST}/password-reset?email=${encodeURIComponent(
          email,
        )}&authCode=${authCode}</a>]`;
        break;
      case 3:
        sendContent = `Hello, please click the link to set your wallet password.[<a href="${WEB_HOST}/wallet-password-reset?email=${encodeURIComponent(
          email,
        )}&authCode=${authCode}">${WEB_HOST}/wallet-password-reset?email=${encodeURIComponent(
          email,
        )}&authCode=${authCode}</a>]`;
        break;
      default:
        break;
    }
    try {
      await aliyunSendEmail(sendContent, email);
    } catch (e) {
      console.log(`sendMSM:${e}`);
    }
    return generateSuccessResponse();
  }

  /**
   *  激活链接
   * @param email
   * @param authCode
   */
  @Post('/activateAccount')
  async activateAccount(
    @Body() { email, authCode }: { email: string; authCode: string },
  ): Promise<CustomResponse<any>> {
    const { currentTimestamp } = getTimestamp();
    const sqlUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (sqlUser && sqlUser.isActive) {
      return generateErrorResponse(
        99,
        'The account has been activated, log in now!',
      );
    }
    const twentyFourHoursAgoTimestamp = currentTimestamp - 24 * 60 * 60 * 1000;

    const profiles = await this.prisma.userProfile.findMany({
      where: {
        email,
        timestamp: {
          gt: twentyFourHoursAgoTimestamp,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (profiles.length === 0) {
      return generateErrorResponse(
        99,
        'The link is invalid, please register again!',
      );
    }

    const profile = profiles[0];

    // 用户已经使用过验证码
    if (profile.isUse) {
      return generateErrorResponse(
        99,
        'The link is invalid, please register again!',
      );
    }

    if (profile?.authCode === authCode) {
      // 更新验证码状态
      await this.prisma.userProfile.update({
        where: {
          id: profile.id,
        },
        data: {
          isUse: true,
        },
      });

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          isActive: true,
        },
      });
      return generateSuccessResponse('Account activation is successful!');
    } else {
      return generateErrorResponse(
        80,
        'The link is invalid, please register again!',
      );
    }
  }

  @Post('/sendSetWalletPasswordEmail')
  @UseGuards(JwtStrategy)
  async sendSetWalletPasswordEmail(
    @Body() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    const sqlUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (sqlUser && sqlUser.isActive) {
      const result = await this.sendEmailLink(sqlUser.email, 3);
      if (result.code !== 100) {
        return result;
      }
    }
    return generateSuccessResponse(
      'The wallet setting link has been sent to your mailbox, please pay attention to check it!',
    );
  }

  @Post('/setWalletPassword')
  async setWalletPassword(
    @Body()
    {
      email,
      authCode,
      walletPassword,
    }: {
      email: string;
      authCode: string;
      walletPassword: string;
    },
  ): Promise<CustomResponse<any>> {
    const { toDayStartTimestamp } = getTimestamp();
    const profiles = await this.prisma.userProfile.findMany({
      where: {
        email,
        timestamp: {
          gt: toDayStartTimestamp,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (profiles.length === 0) {
      return generateErrorResponse(
        99,
        'Wallet password set link is invalid, please resend!',
      );
    }

    const profile = profiles[0];

    // 用户已经使用过验证码
    if (profile.isUse) {
      return generateErrorResponse(
        99,
        'Wallet password set link is invalid, please resend!',
      );
    }

    if (profile?.authCode === authCode) {
      // 更新验证码状态
      await this.prisma.userProfile.update({
        where: {
          id: profile.id,
        },
        data: {
          isUse: true,
        },
      });

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          walletPassword: md5(walletPassword.trim()),
        },
      });

      return generateSuccessResponse('Wallet password successful!');
    } else {
      return generateErrorResponse(
        80,
        'Wallet password set link is invalid, please resend!',
      );
    }
  }

  @Post('/sendPasswordResetEmail')
  async sendPasswordResetEmail(
    @Body() { email }: { email: string },
  ): Promise<CustomResponse<any>> {
    const sqlUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!sqlUser) {
      return generateErrorResponse(99, 'This mailbox does not exist！');
    }
    if (sqlUser && sqlUser.isActive) {
      const result = await this.sendEmailLink(email, 2);
      if (result.code !== 100) {
        return result;
      }
    }

    return generateSuccessResponse();
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body()
    {
      email,
      authCode,
      password,
    }: {
      email: string;
      authCode: string;
      password: string;
    },
  ): Promise<CustomResponse<any>> {
    const { currentTimestamp } = getTimestamp();
    const twentyFourHoursAgoTimestamp = currentTimestamp - 24 * 60 * 60 * 1000;
    const profiles = await this.prisma.userProfile.findMany({
      where: {
        email,
        timestamp: {
          gt: twentyFourHoursAgoTimestamp,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (profiles.length === 0) {
      return generateErrorResponse(
        99,
        'Password reset link is invalid, please resend!',
      );
    }

    const profile = profiles[0];

    // 用户已经使用过验证码
    if (profile.isUse) {
      return generateErrorResponse(
        99,
        'Password reset link is invalid, please resend!',
      );
    }

    if (profile?.authCode === authCode) {
      // 更新验证码状态
      await this.prisma.userProfile.update({
        where: {
          id: profile.id,
        },
        data: {
          isUse: true,
        },
      });

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          password: md5(password),
        },
      });

      return generateSuccessResponse('Password reset successful!');
    } else {
      return generateErrorResponse(
        80,
        'Password reset link is invalid, please resend!',
      );
    }
  }

  @Post('/invite')
  @UseGuards(JwtAuthGuard)
  async invite(@Body() user: UserEntityType): Promise<CustomResponse<any>> {
    const sqlUser = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
    return generateSuccessResponse('', {
      code: String(sqlUser.inviterCode),
      url: `${WEB_HOST}/signup?inviteCode=${sqlUser.inviterCode}`,
    });
  }

  @UseGuards(JwtAuthGuard)
  async team(@Body() user: UserEntityType): Promise<CustomResponse<any>> {
    const sqlUser = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      include: {
        inviteEarningsRecords: true,
      },
    });

    let earnings = 0;
    sqlUser.inviteEarningsRecords.forEach((record) => {
      earnings += Number(record.earnings);
    });
    return generateSuccessResponse('', {
      earnings,
      earningsRecords: sqlUser.inviteEarningsRecords,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/userinfo')
  async userinfo(
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    console.log(user);
    const data = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    return generateSuccessResponse('', { ...data });
  }
}
