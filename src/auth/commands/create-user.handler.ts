import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

import { UserSignUpCommand } from './create-user.command';
import { PasswordService } from '../password.service';
import { AuthRepository } from '../repository/auth.repository';
import { Token, TokenService } from '../token.service';

@Injectable()
@CommandHandler(UserSignUpCommand)
export class UserSignUpHandler implements ICommandHandler<UserSignUpCommand> {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: UserSignUpCommand): Promise<Token> {
    const { name, email, password } = command;

    const hashedPassword = await this.passwordService.hashPassword(password);

    try {
      const user = await this.repository.createUser(
        name,
        email,
        hashedPassword,
      );

      return this.tokenService.generateTokens({ userId: user.id });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${email} already used.`);
      }
      throw new Error(e);
    }
  }
}
