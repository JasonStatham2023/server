import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileController } from './profile/profile.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, ProfileController],
  providers: [AppService],
})
export class AppModule {}
