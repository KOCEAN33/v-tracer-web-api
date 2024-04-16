import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VtuberRepository } from './repository/vtuber.repository';
import Logger, { LoggerKey } from '../../libs/modules/logger/domain/logger';

@Injectable()
export class VtuberService {
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    private readonly vtuberRepository: VtuberRepository,
    private readonly configService: ConfigService,
  ) {}

  async addNewVtuber(name: string, companyId: number, youtubeUrl: string) {
    // check this vtuber is already exists
    const check = await this.vtuberRepository.getYoutubeUrl(youtubeUrl);
    if (!!check) {
      throw new ConflictException('this youtube channel is already exists');
    }
    const vtuber = await this.vtuberRepository.addNewVtuber(
      name,
      companyId,
      youtubeUrl,
    );

    return { message: 'success', vtuber: Number(vtuber.insertId) };
  }

  async addNewCompany(name: string, url: string) {
    const check = await this.vtuberRepository.getCompanyByUrl(url);
    if (check) {
      throw new ConflictException('this company is already exists');
    }
    const company = await this.vtuberRepository.addNewCompany(name, url);
    return { message: 'success', company: Number(company.insertId) };
  }

  async getAllVtubers() {
    return await this.vtuberRepository.getAllVtubers();
  }
}
