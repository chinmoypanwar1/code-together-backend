import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'email',
    });
  }

  validate(password: string) {
    if (password === '')
      throw new UnauthorizedException('Please Provide The Password');
  }
}
