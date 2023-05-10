import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LoginCommand } from './login.command';
import { PrismaService } from '../../prisma.service';
import { AuthService } from '../../auth/auth.service';
import { UserRepository } from '../repository/user.repository';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command;
    const user = await this.userRepository.loginUser(email, password);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}
