import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { UserSignUpCommand } from './signup.command';

@Injectable()
@CommandHandler(UserSignUpCommand)
export class UserSignUpHandler implements ICommandHandler<UserSignUpCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly evnetBus: EventBus,
  ) {}

  async execute(command: UserSignUpCommand): Promise<string> {
    const { name, email, password, fingerprint } = command;

    if (!fingerprint) {
      throw new UnauthorizedException('can not verify browser');
    }

    const checkUser = await this.authRepository.getUserByEmail(email);

    if (checkUser) {
      throw new ConflictException(`this ${email} is already used`);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    await this.authRepository.createUser(name, email, hashedPassword);

    return 'plz check your email';
  }
}
