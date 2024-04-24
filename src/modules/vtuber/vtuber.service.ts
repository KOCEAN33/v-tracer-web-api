import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { VtuberRepository } from './repository/vtuber.repository';
import Logger, { LoggerKey } from '../../libs/logger/domain/logger';

@Injectable()
export class VtuberService {
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    private readonly vtuberRepository: VtuberRepository,
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

  async getVtuberCount() {
    const prevVtuberCount = await this.vtuberRepository.getVtuberCount(
      this.oneMonthAgo(),
      '<=',
    );
    const afterVtuberCount = await this.vtuberRepository.getVtuberCount(
      this.oneMonthAgo(),
      '>',
    );
    const totalCount = prevVtuberCount + afterVtuberCount;
    const percent = (totalCount / afterVtuberCount) * 100;
    return { total: totalCount.toFixed(0), percent: percent.toFixed(1) };
  }

  private oneMonthAgo(): Date {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    return new Date(oneMonthAgo.setMonth(today.getMonth() - 1));
  }
}
