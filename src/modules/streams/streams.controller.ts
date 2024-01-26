import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('/api/vtubers')
export class StreamsController {
  constructor() {}

  @Post('/company')
  async addCompany() {}

  @Post('/platform')
  async addPlatform() {}
}
