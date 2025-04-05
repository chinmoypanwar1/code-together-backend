import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { ConfigModule } from '@nestjs/config';
import googleOathConfig from './config/google-oath.config';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
  ],
  controllers: [AuthController],
  imports: [
    PrismaModule,
    JwtModule.register({}),
    ConfigModule.forFeature(googleOathConfig),
  ],
})
export class AuthModule { }
