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

  async getHello(): Promise<string> {
    // Profile
    this.logger.startProfile('getHello');

    // Await random time
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 1000)),
    );

    // Debug
    this.logger.debug(
      'I am a debug message!',
      {
        props: {
          foo: 'bar',
          baz: 'qux',
        },
      },
      'getHello',
    );

    // Info
    this.logger.info('I am an info message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
    });

    // Warn
    this.logger.warn('I am a warn message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // Error
    this.logger.error('I am an error message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // Fatal
    this.logger.fatal('I am a fatal message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    // Emergency
    this.logger.emergency('I am an emergency message!', {
      props: {
        foo: 'bar',
        baz: 'qux',
      },
      error: new Error('Hello World!'),
    });

    return 'Hello World!';
  }
}
