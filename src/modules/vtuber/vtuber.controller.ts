import { Body, Controller, Get, Post } from '@nestjs/common';
import { CacheTTL } from '@nestjs/cache-manager';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthAdmin } from '../../common/decorators/auth.decorator';

import { VtuberService } from './vtuber.service';
import { AddCompanyReqDTO } from './dto/add-company.req.dto';
import { AddCompanyResDTO } from './dto/add-company.res.dto';
import { AddVtuberReqDTO } from './dto/add-vtuber.req.dto';
import { AddVtuberResDTO } from './dto/add-vtuber.res.dto';
import { GetAllVtuberResDTO } from './dto/get-all-vtuber.res.dto';
import { VtuberCountResDTO } from './dto/vtuber-count.res.dto';

@ApiTags('V-Tuber')
@Controller('/api/vtubers')
export class VtuberController {
  constructor(private vtuberService: VtuberService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add V-Tuber company' })
  @ApiBody({ type: AddCompanyReqDTO })
  @ApiCreatedResponse({
    status: 201,
    type: AddCompanyResDTO,
    description: 'Game Info Array',
  })
  @ApiConflictResponse({ description: 'company already exists' })
  @AuthAdmin()
  @Post('/company')
  async addCompany(@Body() dto: AddCompanyReqDTO): Promise<AddCompanyResDTO> {
    const { name, url } = dto;
    return await this.vtuberService.addNewCompany(name, url);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add V-Tuber' })
  @ApiBody({ type: AddVtuberReqDTO })
  @ApiResponse({
    type: AddVtuberResDTO,
    description: 'success',
  })
  @AuthAdmin()
  @Post('/vtuber')
  async addVtuber(@Body() dto: AddVtuberReqDTO): Promise<AddVtuberResDTO> {
    const { name, companyId, youtubeUrl } = dto;
    return await this.vtuberService.addNewVtuber(name, companyId, youtubeUrl);
  }

  @ApiOperation({ summary: 'Get V-Tuber count' })
  @ApiResponse({
    status: 200,
    type: VtuberCountResDTO,
    description: 'success',
  })
  @Get('/count')
  @CacheTTL(60 * 60 * 1000)
  async vtuberCount(): Promise<VtuberCountResDTO> {
    return this.vtuberService.getVtuberCount();
  }

  @ApiOperation({ summary: 'Get all V-Tubers' })
  @ApiResponse({
    status: 200,
    type: GetAllVtuberResDTO,
    description: 'list of all V-Tubers',
  })
  @Get('/vtuber')
  @CacheTTL(60 * 60 * 1000)
  async getAllVtuber(): Promise<GetAllVtuberResDTO[]> {
    return await this.vtuberService.getAllVtubers();
  }
}
