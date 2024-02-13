import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    // private usersService: UsersService, // private configService: ConfigService<AppConfig>,
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user', 'user:email'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    // For each strategy, Passport will call the verify function (implemented with this
    // `validate()` method in @nestjs/passport) using an appropriate strategy-specific set of
    // parameters. For the passport-github strategy Passport expects a `validate()` method with
    // the following signature:
    //   `validate(accessToken: string, refreshToken: string, profile: Profile): any`
    // As you can see from this, `validate()` receives the access token and optional refresh
    // token, as well as profile which contains the authenticated user's GitHub profile.
    // We can pass these information to find or create the user in our system.
    // The Passport library expects this method to return a full user if the validation
    // succeeds, or a null if it fails. When returning a user, Passport will complete its tasks
    // (e.g., creating the user property on the Request object), and the request
    // handling pipeline can continue.

    const { displayName, photos, provider, emails } = profile;

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
