import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserInfoQuery } from './get-user-info.query';
import { PrismaService } from '../../prisma.service';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler
  implements IQueryHandler<GetUserInfoQuery>
{
  constructor(private prisma: PrismaService) {}
  async execute(query: GetUserInfoQuery) {
    return await this.prisma.user.findUnique({ where: { id: query.userId } });
  }
}
