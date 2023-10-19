import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserLogoutCommand } from './logout.command';
import { AuthRepository } from '../repository/auth.repository';
import { UserAgentParser } from '../ua.service';

interface LogoutResponse {
  message: string;
}

@CommandHandler(UserLogoutCommand)
export class UserLogoutHandler implements ICommandHandler<UserLogoutCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userAgentParser: UserAgentParser,
  ) {}

  async execute(command: UserLogoutCommand): Promise<LogoutResponse> {
    const { response, userId, refreshToken, ip, userAgent, fingerprint } =
      command;

    if (!refreshToken) {
      return { message: 'success logout' };
    }

    const parsedUserAgent = this.userAgentParser.parser(
      userAgent,
      ip,
      fingerprint,
    );

    await this.authRepository.disableRefreshToken(
      userId,
      refreshToken,
      parsedUserAgent,
    );

    // clear httponly cookies
    response.clearCookie('token', {
      sameSite: true,
    });

    return { message: 'success logout' };
  }
}
