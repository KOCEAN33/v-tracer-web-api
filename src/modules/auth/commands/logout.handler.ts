import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserLogoutCommand } from './logout.command';
import { AuthRepository } from '../repository/auth.repository';

interface LogoutResponse {
  message: string;
}

@CommandHandler(UserLogoutCommand)
export class UserLogoutHandler implements ICommandHandler<UserLogoutCommand> {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: UserLogoutCommand): Promise<LogoutResponse> {
    const { response, userId, refreshToken, ip, userAgent } = command;

    // clear httponly cookies
    response.clearCookie('token', {
      sameSite: true,
    });

    if (!refreshToken) {
      return { message: 'success logout' };
    }

    await this.authRepository.disableRefreshToken(
      userId,
      refreshToken,
      ip,
      userAgent,
    );

    return { message: 'success logout' };
  }
}
