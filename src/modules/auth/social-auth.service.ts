import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';

@Injectable()
export class SocialAuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async googleLogin(req: any) {
    return await this.socialAuthorization(req);
  }

  async socialAuthorization(req: any) {
    const {
      email,
      firstName,
      lastName,
      picture,
      provider,
      externalId,
      accessToken,
      refreshToken,
    } = req.user;

    const findUser = await this.authRepository.getUserBySocialId(externalId);

    if (!findUser) {
      const checkUser = await this.authRepository.getUserByEmail(email);

      if (checkUser) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'this email is already exist',
        };
      }

      const createUser = await this.authRepository.createSocialAccount(
        email,
        firstName,
        lastName,
        picture,
        provider,
        externalId,
        accessToken,
        refreshToken,
      );
      return {
        message: 'Google Auth Account Created',
        userId: createUser,
        externalId,
        provider,
        accessToken,
      };
    }

    await this.authRepository.updateSocialAuth(
      findUser.user_id,
      externalId,
      accessToken,
      provider,
    );

    return {
      message: 'Google Auth Information',
      userId: findUser.user_id,
      externalId,
      provider,
      accessToken,
    };
  }
}
