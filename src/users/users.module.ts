import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersService, AuthService, PrismaService, JwtService, Object],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
