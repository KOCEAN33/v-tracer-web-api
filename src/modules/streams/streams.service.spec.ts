import { Test } from '@nestjs/testing';

import { StreamsService } from './streams.service';
import { StreamsRepository } from './repository/streams.repository';

describe('StreamsService', () => {
  let service: StreamsService;
  let repository: StreamsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        StreamsService,
        {
          provide: StreamsRepository,
          useValue: {
            getTotalStreamTime: jest.fn(),
            getNonGameStreamsCount: jest.fn(),
            getGameStreamCount: jest.fn(),
            getRecentStreams: jest.fn(),
            getTotalStreamsCount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<StreamsService>(StreamsService);
    repository = moduleRef.get<StreamsRepository>(StreamsRepository);
  });

  describe('getTotalStreamTime', () => {
    it('should return the total stream time and percentage', async () => {
      const prevTotalTime = 3600; // 1 hour
      const afterStreamTime = 7200; // 2 hours

      jest
        .spyOn(repository, 'getTotalStreamTime')
        .mockResolvedValueOnce(prevTotalTime)
        .mockResolvedValueOnce(afterStreamTime);

      const result = await service.getTotalStreamTime();

      expect(repository.getTotalStreamTime).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        total: '3.0',
        percent: '66.7',
      });
    });
  });

  describe('getGameStreamRatio', () => {
    it('should return the game stream ratio and percentage', async () => {
      const prevNonGameStreamsCount = 10;
      const prevGameStreamsCount = 20;
      const afterNonGameStreamsCount = 15;
      const afterGameStreamsCount = 35;

      // 66.7 80
      //25 /55
      jest
        .spyOn(repository, 'getNonGameStreamsCount')
        .mockResolvedValueOnce(prevNonGameStreamsCount)
        .mockResolvedValueOnce(afterNonGameStreamsCount);

      jest
        .spyOn(repository, 'getGameStreamCount')
        .mockResolvedValueOnce(prevGameStreamsCount)
        .mockResolvedValueOnce(afterGameStreamsCount);

      const result = await service.getGameStreamRatio();

      expect(repository.getNonGameStreamsCount).toHaveBeenCalledTimes(2);
      expect(repository.getGameStreamCount).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        total: '68.75',
        percent: '2.1',
      });
    });
  });

  describe('getRecentStreams', () => {
    it('should return the recent streams with modified stream titles', async () => {
      const recentStreams = [
        {
          stream_id: 'fhsadjhg',
          stream_title: '【Title1】Stream 1',
          image: 'image1.jpg',
          game_title: 'Game 1',
        },
        {
          stream_id: 'shdflka',
          stream_title: '【Title2】Stream 2',
          image: 'image2.jpg',
          game_title: 'Game 2',
        },
      ];

      jest
        .spyOn(repository, 'getRecentStreams')
        .mockResolvedValue(recentStreams);

      const result = await service.getRecentStreams();

      expect(repository.getRecentStreams).toHaveBeenCalled();
      expect(result).toEqual([
        {
          streamId: 'fhsadjhg',
          streamTitle: 'Stream 1',
          image: 'image1.jpg',
          gameTitle: 'Game 1',
        },
        {
          streamId: 'shdflka',
          streamTitle: 'Stream 2',
          image: 'image2.jpg',
          gameTitle: 'Game 2',
        },
      ]);
    });
  });

  describe('getStreamsCount', () => {
    it('should return the total streams count and percentage', async () => {
      const prevStreamsCount = 100;
      const afterStreamsCount = 150;

      jest
        .spyOn(repository, 'getTotalStreamsCount')
        .mockResolvedValueOnce(prevStreamsCount)
        .mockResolvedValueOnce(afterStreamsCount);

      const result = await service.getStreamsCount();

      expect(repository.getTotalStreamsCount).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        total: '250',
        percent: '60.0',
      });
    });
  });
});
