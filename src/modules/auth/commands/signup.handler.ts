import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { Token, TokenService } from '../token.service';
import { UserSignUpCommand } from './signup.command';

@Injectable()
@CommandHandler(UserSignUpCommand)
export class UserSignUpHandler implements ICommandHandler<UserSignUpCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly evnetBus: EventBus,
  ) {}

  async execute(command: UserSignUpCommand): Promise<Token> {
    const { name, handle, email, password } = command;

    await this.isUserExist(handle, email);

    const hashedPassword = await this.passwordService.hashPassword(password);

    const user = await this.authRepository.createUser(
      name,
      email,
      hashedPassword,
    );

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({ userId: user.id });

    // this.evnetBus.publish(
    //   new CreateNewTokenEvent(user.id, accessToken, refreshToken),
    // );

    return { accessToken, refreshToken };
  }

  private async isUserExist(handle: string, email: string) {
    const checkEmail = await Promise.all([
      this.authRepository.getUserByEmail(email),
    ]);

    if (checkEmail !== null) {
      throw new UnprocessableEntityException(`Email ${email} already used.`);
    }
  }
}