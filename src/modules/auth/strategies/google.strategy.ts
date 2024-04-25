import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  // this sets need to get refresh token
  // authorizationParams(): { [key: string]: string } {
  //   return {
  //     access_type: 'offline',
  //     prompt: 'select_account',
  //   };
  // }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: any,
    // done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, provider, photos } = profile;
    return {
      email: emails[0].value,
      name: displayName,
      picture: photos[0].value,
      provider: provider,
      externalId: profile.id,
      accessToken,
    };
  }
}
