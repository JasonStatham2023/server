import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomResponse } from '../models';
import { generateErrorResponse, generateSuccessResponse } from '../utils';
import { PrismaService } from '../prisma.service';
import { Authorized } from '../decorators';
import { UserEntityType } from '../types';

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
  ) {
    const taskMap = {
      1: async () => {
        const count = await this.prisma.signInRecord.count({
          where: {
            userId: user.id,
          },
        });
      }, // 签到 领取一元
    };

    if (taskMap[taskId]) {
      return await taskMap[taskId]();
    } else {
      generateErrorResponse(99, 'task id does not exist');
    }
  }

  async task1() {}
}
