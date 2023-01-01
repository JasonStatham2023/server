import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileController } from './profile/profile.controller';
import { ZonesController } from './zones/zones.controller';
import { PrismaService } from './prisma.service';
import { FileController } from './file/file.controller';
import { VideoController } from './video/video.controller';
import { WithdrawalController } from './withdrawal/withdrawal.controller';
import { RechargeController } from './recharge/recharge.controller';
import { SignInController } from './sign-in/sign-in.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, ProfileController, ZonesController, FileController, VideoController, WithdrawalController, RechargeController, SignInController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
