import { Test } from '@nestjs/testing';

import { GetGameRankingHandler } from './get-game-ranking.handler';
import { GetGameRankingQuery } from './get-game-ranking.query';
import { GamesRepository } from '../repository/games.repository';

describe('GetGameRankingHandler', () => {
  let handler: GetGameRankingHandler;
  let repository: GamesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetGameRankingHandler,
        {
          provide: GamesRepository,
          useValue: {
            getPlayedGameRanking: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<GetGameRankingHandler>(GetGameRankingHandler);
    repository = moduleRef.get<GamesRepository>(GamesRepository);
  });

  describe('execute', () => {
    it('should return the game ranking with converted duration', async () => {
      const gameRanking = [
        {
          game_id: 1,
          title: 'Game 1',
          total_duration: 7200, // 2 hours
        },
        {
          game_id: 2,
          title: 'Game 2',
          total_duration: 10800, // 3 hours
        },
      ];

      jest
        .spyOn(repository, 'getPlayedGameRanking')
        .mockResolvedValue(gameRanking);

      const result = await handler.execute();

      expect(repository.getPlayedGameRanking).toHaveBeenCalled();
      expect(result).toEqual([
        {
          gameId: 1,
          gameTitle: 'Game 1',
          duration: '2.0',
        },
        {
          gameId: 2,
          gameTitle: 'Game 2',
          duration: '3.0',
        },
      ]);
    });

    it('should handle empty game ranking', async () => {
      jest.spyOn(repository, 'getPlayedGameRanking').mockResolvedValue([]);

      const result = await handler.execute();

      expect(repository.getPlayedGameRanking).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('convertTimeToHours', () => {
    it('should convert time to hours with one decimal place', () => {
      expect(handler['convertTimeToHours'](3600)).toBe('1.0');
      expect(handler['convertTimeToHours'](7200)).toBe('2.0');
      expect(handler['convertTimeToHours'](10800)).toBe('3.0');
    });
  });
});
