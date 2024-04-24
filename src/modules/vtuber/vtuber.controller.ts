import { Body, Controller, Get, Post } from '@nestjs/common';

import { AddVtuberDto } from './dto/add-vtuber.dto';
import { VtuberService } from './vtuber.service';
import { AddCompanyDto } from './dto/add-company.dto';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('/api/vtubers')
export class VtuberController {
  constructor(private vtuberService: VtuberService) {}

  @Post('/company')
  async addCompany(@Body() dto: AddCompanyDto) {
    const { name, url } = dto;
    return await this.vtuberService.addNewCompany(name, url);
  }

  @Post('/vtuber')
  async addVtuber(@Body() dto: AddVtuberDto) {
    const { name, companyId, youtubeUrl } = dto;
    return await this.vtuberService.addNewVtuber(name, companyId, youtubeUrl);
  }

  @Get('/vtuber')
  @CacheTTL(60 * 60 * 1000)
  async getAllVtuber() {
    return await this.vtuberService.getAllVtubers();
  }

  @Get('/count')
  @CacheTTL(60 * 60 * 1000)
  async vtuberCount() {
    return this.vtuberService.getVtuberCount();
  }
}
