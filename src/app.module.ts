import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileController } from './profile/profile.controller';
import { ZonesController } from './zones/zones.controller';
import { PrismaService } from './prisma.service';
import { FileController } from './file/file.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, ProfileController, ZonesController, FileController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
