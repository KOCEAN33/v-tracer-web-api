import { Injectable } from '@nestjs/common';

import { StreamsRepository } from './repository/streams.repository';

@Injectable()
export class StreamsService {
  constructor(private readonly streamRepository: StreamsRepository) {}

  async getTotalStreamTime() {
    const prevTotalTime = await this.streamRepository.getTotalStreamTime(
      this.oneMonthAgo(),
      '<=',
    );
    const afterStreamTime = await this.streamRepository.getTotalStreamTime(
      this.oneMonthAgo(),
      '>',
    );

    const percent = this.calculatePercentage(afterStreamTime, prevTotalTime);

    const convertHours =
      (Number(prevTotalTime) + Number(afterStreamTime)) / (60 * 60);
    return {
      total: convertHours.toFixed(1),
      percent: percent.toFixed(1),
    };
  }

  async getGameStreamRatio() {
    // One Month Ago Percentage
    const prevNonGameStreamsCount =
      await this.streamRepository.getNonGameStreamsCount(
        this.oneMonthAgo(),
        '<=',
      );
    const prevGameStreamsCount = await this.streamRepository.getGameStreamCount(
      this.oneMonthAgo(),
      '<=',
    );
    const prevGameStreamRatio = this.calculatePercentage(
      prevGameStreamsCount,
      prevNonGameStreamsCount,
    );

    // After one month count
    const afterNonGameStreamsCount =
      await this.streamRepository.getNonGameStreamsCount(
        this.oneMonthAgo(),
        '>',
      );
    const afterGameStreamsCount =
      await this.streamRepository.getGameStreamCount(this.oneMonthAgo(), '>');

    // current game stream ratio
    const currentGameStreamRatio = this.calculatePercentage(
      afterGameStreamsCount + prevGameStreamsCount,
      afterNonGameStreamsCount + prevNonGameStreamsCount,
    );
    const percent =
      Number(currentGameStreamRatio) - Number(prevGameStreamRatio);

    return {
      total: currentGameStreamRatio.toFixed(2),
      percent: percent.toFixed(1),
    };
  }

  async getRecentStreams() {
    const recentStreams = await this.streamRepository.getRecentStreams();
    return recentStreams.map((recentStream) => {
      return {
        streamId: recentStream.stream_id,
        streamTitle: this.removeAngle(recentStream.stream_title),
        image: recentStream.image,
        gameTitle: recentStream.game_title,
      };
    });
  }

  async getStreamsCount() {
    const prevStreamsCount = (await this.streamRepository.getTotalStreamsCount(
      this.oneMonthAgo(),
      '<=',
    )) as number;
    const afterStreamsCount = (await this.streamRepository.getTotalStreamsCount(
      this.oneMonthAgo(),
      '>',
    )) as number;
    const totalCount = prevStreamsCount + afterStreamsCount;
    const percent = this.calculatePercentage(
      afterStreamsCount,
      prevStreamsCount,
    );

    return {
      total: totalCount.toFixed(0),
      percent: percent.toFixed(1),
    };
  }

  private removeAngle(text: string): string {
    return text.replace(/【[^】]*】/g, '');
  }

  private oneMonthAgo(): Date {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    return new Date(oneMonthAgo.setMonth(today.getMonth() - 1));
  }

  // mainValue for kye value as percentage
  private calculatePercentage(mainValue: number, partValue: number): number {
    const total = Number(partValue) + Number(mainValue);
    return (mainValue / total) * 100;
  }
}
