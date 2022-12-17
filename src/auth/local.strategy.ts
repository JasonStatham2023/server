import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntityType } from '../types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(userEntity: UserEntityType): Promise<any> {
    const user = await this.authService.validateUser(userEntity);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
