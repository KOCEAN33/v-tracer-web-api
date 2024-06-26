import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Injectable } from '@nestjs/common';

import { UserSignUpCommand } from './signup.command';
import { SendVerifyEmailEvent } from '../events/send-verify-email.event';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';

@Injectable()
@CommandHandler(UserSignUpCommand)
export class UserSignUpHandler implements ICommandHandler<UserSignUpCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UserSignUpCommand) {
    const { name, email, password } = command;

    // Confirm E-Mail is Unique
    const checkUser = await this.authRepository.getUserByEmail(email);
    if (checkUser) {
      throw new ConflictException(`this ${email} is already used`);
    }

    // Hashing Password
    const hashedPassword = await this.passwordService.hashPassword(password);

    // Add to Database
    const newUser = await this.authRepository.createUserByEmail(
      name,
      email,
      hashedPassword,
    );

    // Send email to verify user
    this.eventBus.publish(new SendVerifyEmailEvent(newUser, email));

    return { message: 'please verify your email' };
  }
}
