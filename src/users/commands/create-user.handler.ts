import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../repository/user.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;
    const userExist = await this.repository.checkUserExists(email);
    if (userExist) {
      throw new Error('User already exist');
    }
    console.log(name, email, password);
    await this.repository.saveUser(name, email, password);
  }
}
