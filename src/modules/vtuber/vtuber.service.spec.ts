import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { VtuberService } from './vtuber.service';
import { VtuberRepository } from './repository/vtuber.repository';
import Logger, { LoggerKey } from '../../libs/logger/domain/logger';
import { YoutubeStatus } from '../../@types/enums';

describe('VtuberService', () => {
  let service: VtuberService;
  let repository: VtuberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VtuberService,
        {
          provide: VtuberRepository,
          useValue: {
            getYoutubeUrl: jest.fn(),
            addNewVtuber: jest.fn(),
            getCompanyByUrl: jest.fn(),
            addNewCompany: jest.fn(),
            getAllVtubers: jest.fn(),
            getVtuberCount: jest.fn(),
          },
        },
        {
          provide: LoggerKey,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VtuberService>(VtuberService);
    repository = module.get<VtuberRepository>(VtuberRepository);
  });

  describe('addNewVtuber', () => {
    it('should add a new vtuber', async () => {
      const name = 'Test Vtuber';
      const companyId = 1;
      const youtubeUrl = 'https://www.youtube.com/@tsuna_nekota';
      const insertId = {
        insertId: BigInt(1),
        numInsertedOrUpdatedRows: BigInt(1),
      };

      jest.spyOn(repository, 'getYoutubeUrl').mockResolvedValue(null);
      jest.spyOn(repository, 'addNewVtuber').mockResolvedValue(insertId);

      const result = await service.addNewVtuber(name, companyId, youtubeUrl);

      expect(repository.getYoutubeUrl).toBeCalledWith(youtubeUrl);
      expect(repository.addNewVtuber).toBeCalledWith(
        name,
        companyId,
        youtubeUrl,
      );
      expect(result).toEqual({
        message: 'success',
        vtuberId: Number(insertId.insertId),
      });
    });

    it('should throw a ConflictException if the youtube channel already exists', async () => {
      const name = 'Test Vtuber';
      const companyId = 1;
      const youtubeUrl = { url: 'https://www.youtube.com/@tsuna_nekota' };

      jest.spyOn(repository, 'getYoutubeUrl').mockResolvedValue(youtubeUrl);

      await expect(
        service.addNewVtuber(name, companyId, youtubeUrl.url),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('addNewCompany', () => {
    it('should add a new company', async () => {
      const name = 'Test Company';
      const url = 'https://testcompany.com';
      const insertId = {
        insertId: BigInt(1),
        numInsertedOrUpdatedRows: BigInt(1),
      };

      jest.spyOn(repository, 'getCompanyByUrl').mockResolvedValue(null);
      jest.spyOn(repository, 'addNewCompany').mockResolvedValue(insertId);

      const result = await service.addNewCompany(name, url);

      expect(repository.getCompanyByUrl).toBeCalledWith(url);
      expect(repository.addNewCompany).toBeCalledWith(name, url);
      expect(result).toEqual({
        message: 'success',
        companyId: Number(insertId.insertId),
      });
    });

    it('should throw a ConflictException if the company already exists', async () => {
      const name = 'Test Company';
      const url = { url: 'https://testcompany.com' };

      jest.spyOn(repository, 'getCompanyByUrl').mockResolvedValue(url);

      await expect(service.addNewCompany(name, url.url)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getAllVtubers', () => {
    it('should return all vtubers', async () => {
      const vtubers = [
        {
          id: 1,
          name: 'Test Vtuber',
          url: 'http://test.com',
          status: 'activated' as YoutubeStatus,
        },
      ];

      jest.spyOn(repository, 'getAllVtubers').mockResolvedValue(vtubers);

      const result = await service.getAllVtubers();

      expect(repository.getAllVtubers).toBeCalled();
      expect(result).toEqual(vtubers);
    });
  });

  describe('getVtuberCount', () => {
    it('should return the vtuber count and percentage', async () => {
      const prevVtuberCount = 100;
      const afterVtuberCount = 20;

      jest
        .spyOn(repository, 'getVtuberCount')
        .mockResolvedValueOnce(prevVtuberCount)
        .mockResolvedValueOnce(afterVtuberCount);

      const result = await service.getVtuberCount();

      expect(repository.getVtuberCount).toBeCalledTimes(2);
      expect(result).toEqual({
        total: '120',
        percent: '20.0',
      });
    });
  });
});
