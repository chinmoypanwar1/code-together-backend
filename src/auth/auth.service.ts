import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { GoogleUserDto } from './dto/google-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  hashPassword(password: string) {
    const hashedPassword = bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          user_id: userId,
          username: username,
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          user_id: userId,
          username: username,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signupLocal(signupDto: SignupDto) {
    // Get all the data
    const { username, email, password } = signupDto;

    const userExists = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userExists)
      throw new ForbiddenException(
        'User already exists with the following email address.',
      );

    // Hash the password
    const hashedPassword = await this.hashPassword(password);

    // Create a new user in DB
    const newUser = await this.prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    if (!newUser) {
      throw new InternalServerErrorException('The server is not working fine.');
    }

    // Create a new AT and RT
    const { accessToken, refreshToken } = await this.getTokens(
      newUser.user_id,
      newUser.username,
    );
    // Store RT and expRT in DB
    const updatedUser = await this.prisma.user.update({
      where: {
        user_id: newUser.user_id,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException('The server is not working fine.');
    }
    // Send AT and RT to Client
    const response = {
      tokens: {
        accessToken,
        refreshToken,
      },
    };
    return response;
  }

  async loginLocal(loginDto: LoginDto) {
    // Get all the data
    const { email, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new ForbiddenException(
        'No user exists with the following email. Please signup first.',
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ForbiddenException('Please enter correct password.');
    }

    // Create a new AT and RT
    const { accessToken, refreshToken } = await this.getTokens(
      user.user_id,
      user.username,
    );

    // Update the RT and expRt in DB
    const updatedUser = await this.prisma.user.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'There is something wrong with the server',
      );
    }

    // Send AT and RT to Client
    const response = {
      tokens: {
        accessToken,
        refreshToken,
      },
    };
    return response;
  }

  // TODO: handle double logout
  async logoutLocal(userId: string) {
    await this.prisma.user.update({
      where: {
        user_id: userId,
        refresh_token: {
          not: null,
        },
      },
      data: {
        refresh_token: null,
      },
    });
  }

  async refreshTokens(userId: string, givenRefreshToken: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const refreshTokenMatches =
      givenRefreshToken === user.refresh_token ? true : false;

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken } = await this.getTokens(
      user.user_id,
      user.username,
    );

    const response = {
      tokens: {
        accessToken,
        givenRefreshToken,
      },
    };

    return response;
  }

  async validateGoogleUser(googleUser: GoogleUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: googleUser.email,
      },
    });
    if (user) return user;
  }

  async loginGoogle(googleUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: googleUserId,
      },
    });

    if (!user) {
      throw new ForbiddenException('No user exists.');
    }
    const { accessToken, refreshToken } = await this.getTokens(
      user?.user_id,
      user?.username,
    );

    return {
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }
}
