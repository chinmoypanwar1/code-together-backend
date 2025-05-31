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
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token/refresh-token.guard';
import { Public } from 'src/common/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('/local/signup')
  async signupLocal(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.signupLocal(signupDto);
    response.cookie('refreshToken', `${tokens.tokens.refreshToken}`, {
      httpOnly: true,
      maxAge: 900000,
    });
    response.cookie('accessToken', `${tokens.tokens.accessToken}`, {
      maxAge: 900000,
    });
  }

  @Public()
  @Post('/local/login')
  async loginLocal(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.loginLocal(loginDto);
    response.cookie('accessToken', `${tokens.tokens.accessToken}`, {
      maxAge: 900000,
    });
    response.cookie('refreshToken', `${tokens.tokens.refreshToken}`, {
      httpOnly: true,
      maxAge: 900000,
    });
  }

  // TODO: Handle the logout function remove the cookies from the frontend as well.

  @Post('/local/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() response: Response) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    await this.authService.logoutLocal(user['user_id']);
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return response.send({
      data: '',
      message: 'Logged out the user successfully',
      success: 'Success',
    });
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/local/refreshTokens')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user;
    if (!user || !user['user_id'] || !user['refreshToken']) {
      throw new Error('User not found');
    }
    const tokens = await this.authService.refreshTokens(
      user['user_id'],
      user['refreshToken'],
    );
    response.cookie('accessToken', `${tokens.tokens.accessToken}`, {
      maxAge: 900000,
    });
    response.cookie('refreshToken', `${tokens.tokens.givenRefreshToken}`, {
      httpOnly: true,
      maxAge: 900000,
    });
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  async googleLogin() { }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async googleCallback(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.loginGoogle(req.user.user_id);
    response.cookie('accessToken', `${tokens.tokens.accessToken}`, {
      maxAge: 900000,
    });
    response.cookie('refreshToken', `${tokens.tokens.refreshToken}`, {
      httpOnly: true,
      maxAge: 900000,
    });
  }
}
