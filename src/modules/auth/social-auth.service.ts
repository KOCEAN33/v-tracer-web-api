import { Injectable } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';

@Injectable()
export class SocialAuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async socialAuthorization(req: any) {
    const { email, name, picture, provider, externalId, accessToken } =
      req.user;

    const findUser = await this.authRepository.getUserBySocialId(
      externalId,
      provider,
    );

    if (!findUser) {
      const checkUser = await this.authRepository.getUserByEmail(email);

      if (checkUser) {
        return 'conflict';
      }

      const newUser = await this.authRepository.createSocialAccount(
        email,
        name,
        picture,
        provider,
        externalId,
        accessToken,
      );
      return { userId: newUser.id, role: newUser.role };
    }

    return { userId: findUser.user_id, role: findUser.role };
  }
}
