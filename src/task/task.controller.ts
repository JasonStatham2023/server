import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomResponse } from '../models';
import { generateErrorResponse, generateSuccessResponse } from '../utils';
import { PrismaService } from '../prisma.service';
import { Authorized } from '../decorators';
import { UserEntityType } from '../types';
import { getCurrentMonthTimestamp } from '../utils/getCurrentMonthTimestamp';

interface Task {
  id: number;
  title: string;
  desc: string;
  isDone: boolean;
}

const createTaskList = (): Task[] => {
  return [
    {
      id: 1,
      title: 'Tarefa um',
      desc: 'Clique para fazer check-in e receber R$1',
      isDone: false,
    },
    {
      id: 2,
      title: 'Tarefa dois',
      desc: 'Reproduza 5 anúncios e receba R$1',
      isDone: false,
    },
    {
      id: 3,
      title: 'Tarefa três',
      desc: 'Defina uma senha de transação para receber R$5',
      isDone: false,
    },
    {
      id: 4,
      title: 'Tarefa quatro',
      desc: 'Vincule sua conta PIX para receber R$5',
      isDone: false,
    },
    {
      id: 5,
      title: 'Tarefa cinco',
      desc: 'Reproduza 55 anúncios por mês e receba R$10',
      isDone: false,
    },
    {
      id: 6,
      title: 'Tarefa seis',
      desc: 'Reproduza 155 anúncios por mês e receba R$30',
      isDone: false,
    },
    {
      id: 7,
      title: 'Tarefa sete',
      desc: 'Reproduza 355 anúncios por mês e receba R$100',
      isDone: false,
    },
    {
      id: 8,
      title: 'Tarefa oito',
      desc: 'Reproduza 855 anúncios por mês e receba R$300',
      isDone: false,
    },
  ];
};

@Controller('task')
export class TaskController {
  constructor(readonly prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/info')
  async info(): Promise<CustomResponse<Task[]>> {
    return generateSuccessResponse('', []);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/receive')
  async receive(
    @Body() { taskId }: { taskId: number },
    @Authorized() user: UserEntityType,
  ): Promise<CustomResponse<any>> {
    const taskMap = {
      1: async (): Promise<CustomResponse<any>> => {
        const taskCount = await this.prisma.taskRecord.count({
          where: {
            userId: user.id,
            taskId,
          },
        });

        if (taskCount) {
          return generateErrorResponse(99, 'This task has been completed');
        }

        const signInCount = await this.prisma.signInRecord.count({
          where: {
            userId: user.id,
          },
        });

        if (!signInCount) {
          return generateErrorResponse(99, 'Did not sign in');
        }
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            balance: {
              increment: 1,
            },
          },
        });
        await this.prisma.taskRecord.create({
          data: {
            userId: user.id,
            taskId,
          },
        });
        return generateSuccessResponse('Congratulations on getting 1 yuan');
      }, // 签到 领取一元
      2: async (): Promise<CustomResponse<any>> => {
        const taskCount = await this.prisma.taskRecord.count({
          where: {
            userId: user.id,
            taskId,
          },
        });

        if (taskCount) {
          return generateErrorResponse(99, 'This task has been completed');
        }

        const orderCount = await this.prisma.orderRecord.count({
          where: {
            userId: user.id,
          },
        });
        if (orderCount < 5) {
          return generateErrorResponse(99, 'The task is not completed');
        }
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            balance: {
              increment: 1,
            },
          },
        });
        await this.prisma.taskRecord.create({
          data: {
            userId: user.id,
            taskId,
          },
        });
        return generateSuccessResponse('Congratulations on getting 1 yuan');
      },
      3: async (): Promise<CustomResponse<any>> => {
        const taskCount = await this.prisma.taskRecord.count({
          where: {
            userId: user.id,
            taskId,
          },
        });

        if (taskCount) {
          return generateErrorResponse(99, 'This task has been completed');
        }

        const { walletPassword } = await this.prisma.user.findUnique({
          where: { id: user.id },
        });
        if (!walletPassword) {
          return generateErrorResponse(99, 'The task is not completed');
        }
        await this.prisma.taskRecord.create({
          data: {
            userId: user.id,
            taskId,
          },
        });
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            balance: {
              increment: 5,
            },
          },
        });
        return generateSuccessResponse('Congratulations on getting 5 yuan');
      },
      4: async (): Promise<CustomResponse<any>> => {
        const taskCount = await this.prisma.taskRecord.count({
          where: {
            userId: user.id,
            taskId,
          },
        });

        if (taskCount) {
          return generateErrorResponse(99, 'This task has been completed');
        }

        const { pixCompellation, pixAccount } =
          await this.prisma.user.findUnique({
            where: { id: user.id },
          });
        if (!pixCompellation || !pixAccount) {
          return generateErrorResponse(99, 'The task is not completed');
        }
        await this.prisma.taskRecord.create({
          data: {
            userId: user.id,
            taskId,
          },
        });
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            balance: {
              increment: 5,
            },
          },
        });
        return generateSuccessResponse('Congratulations on getting 5 yuan');
      },
      5: async (): Promise<CustomResponse<any>> => {
        return this.playTask({
          userId: user.id,
          taskId,
          frequency: 55,
          reward: 10,
        });
      },
      6: async (): Promise<CustomResponse<any>> => {
        return this.playTask({
          userId: user.id,
          taskId,
          frequency: 155,
          reward: 30,
        });
      },
      7: async (): Promise<CustomResponse<any>> => {
        return this.playTask({
          userId: user.id,
          taskId,
          frequency: 355,
          reward: 100,
        });
      },
      8: async (): Promise<CustomResponse<any>> => {
        return this.playTask({
          userId: user.id,
          taskId,
          frequency: 855,
          reward: 300,
        });
      },
    };

    if (taskMap[taskId]) {
      return await taskMap[taskId]();
    } else {
      generateErrorResponse(99, 'task id does not exist');
    }
  }

  async playTask({
    userId,
    taskId,
    frequency,
    reward,
  }): Promise<CustomResponse<any>> {
    const { toMonthEndTimestamp, toMonthStartTimestamp, currentTimestamp } =
      getCurrentMonthTimestamp();
    const taskCount = await this.prisma.taskRecord.count({
      where: {
        userId: userId,
        taskId,
        timestamp: {
          gt: toMonthStartTimestamp,
          lt: toMonthEndTimestamp,
        },
      },
    });

    if (taskCount) {
      return generateErrorResponse(99, 'This task has been completed');
    }

    const orderCount = await this.prisma.orderRecord.count({
      where: {
        userId: userId,
        timestamp: {
          gt: toMonthStartTimestamp,
          lt: toMonthEndTimestamp,
        },
      },
    });

    if (orderCount < frequency) {
      return generateErrorResponse(99, 'This task has been completed');
    }
    await this.prisma.taskRecord.create({
      data: {
        userId,
        taskId,
        timestamp: currentTimestamp,
      },
    });
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: {
          increment: reward,
        },
      },
    });
    return generateSuccessResponse('Congratulations on getting 10 yuan');
  }
}
