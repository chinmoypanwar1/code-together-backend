import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

type JwtPayload = {
  userId: string;
  username: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          console.log(
            'The cookies have refreshToken such as: ',
            req?.cookies?.refreshToken,
          );
          return req?.cookies?.refreshToken || null;
        },
      ]),
      secretOrKey:
        process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req?.cookies?.refreshToken;
    console.log('The refreshToken from validate function is: ', refreshToken);
    return { ...payload, refreshToken };
  }
}
