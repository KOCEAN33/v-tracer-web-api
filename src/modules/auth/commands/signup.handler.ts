import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { UserSignUpCommand } from './signup.command';
import { VerifyEmailCommand } from '../../email/commands/verify-email.command';

@Injectable()
@CommandHandler(UserSignUpCommand)
export class UserSignUpHandler implements ICommandHandler<UserSignUpCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: UserSignUpCommand): Promise<string> {
    const { name, email, password, fingerprint } = command;

    // Block unknown system
    if (!fingerprint) {
      throw new UnauthorizedException('can not verify browser');
    }

    // Confirm E-Mail is Unique
    const checkUser = await this.authRepository.getUserByEmail(email);
    if (checkUser) {
      throw new ConflictException(`this ${email} is already used`);
    }

    // Hashing Password
    const hashedPassword = await this.passwordService.hashPassword(password);

    // Add to Database
    const save = await this.authRepository.createUser(
      name,
      email,
      hashedPassword,
    );

    // Send email to verify user
    const verifyEmailCommand = new VerifyEmailCommand(save.id, email);
    const mail = await this.commandBus.execute(verifyEmailCommand);

    if (mail.status === 400) {
      throw new UnprocessableEntityException('Fail to send email');
    }

    if (mail.status === 200) {
      // TODO: change return to useful value
      return 'plz check your email';
    }
  }
}
