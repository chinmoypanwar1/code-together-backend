import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token/refresh-token.guard';
import { Public } from 'src/common/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  async signupLocal(@Body() signupDto: SignupDto) {
    return this.authService.signupLocal(signupDto);
  }

  @Public()
  @Post('/local/login')
  async loginLocal(@Body() loginDto: LoginDto) {
    return await this.authService.loginLocal(loginDto);
  }

  @Post('/local/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    return await this.authService.logoutLocal(user['user_id']);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/local/refreshTokens')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request) {
    const user = req.user;
    if (!user || !user['user_id'] || !user['refreshToken']) {
      throw new Error('User not found');
    }
    return await this.authService.refreshTokens(
      user['user_id'],
      user['refreshToken'],
    );
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  async googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.loginGoogle(req.user.user_id);
    res.redirect(`${process.env.FRONTEND_URL}?token=${response.accessToken}`);
  }
}
