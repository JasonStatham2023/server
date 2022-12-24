import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PrismaService } from '../prisma.service';
import { UserEntityType } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(userEntity: UserEntityType): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userEntity.email,
      },
    });
    if (user) {
      return { ...userEntity, isAdmin: !!user.isAdmin };
    }
    return null;
  }

  async login(user: any): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign(user, {
        secret: jwtConstants.secret,
      }),
    };
  }
}
