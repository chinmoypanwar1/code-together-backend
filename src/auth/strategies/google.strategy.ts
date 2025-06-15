import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ForbiddenException, Inject } from '@nestjs/common';
import googleOathConfig from '../config/google-oath.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOathConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOathConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientID || 'fallback_Client_ID',
      clientSecret:
        googleConfiguration.clientSecret || 'fallback_Client_Secret',
      callbackURL: googleConfiguration.callbackURL || 'fallback_Callback_Url',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    if (!profile || !profile.emails || !profile.name) {
      throw new ForbiddenException('Please sign in with google first');
    }
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      password: '',
    });
    return {
      user,
      isRegistered: !!user,
    };
  }
}
