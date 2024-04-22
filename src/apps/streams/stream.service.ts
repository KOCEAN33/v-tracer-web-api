import { Injectable } from '@nestjs/common';
import { StreamRepository } from './repository/stream.repository';

@Injectable()
export class StreamService {
  constructor(private readonly streamRepository: StreamRepository) {}

  async getTotalStreamTime() {

    const convertHours = totalStreamTime / (60 * 60);
    return convertHours.toFixed(1);
  }

  async getGameStreamRatio() {
    const totalStreamsCount = await this.streamRepository.getStreamsCount();
    const gameStreamsCount = await this.streamRepository.getGameStreamRatio();

    return this.calculatePercentage(totalStreamsCount, gameStreamsCount);
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
    const streamsCount = await this.streamRepository.getStreamsCount();
    return streamsCount;
  }

  private calculatePercentage(total: number, part: number): string {
    const percent = (part / total) * 100;
    return percent.toFixed(2);
  }

  private removeAngle(text: string): string {
    return text.replace(/【[^】]*】/g, '');
  }

  private oneMonthAgo() {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    return new Date(oneMonthAgo.setMonth(today.getMonth() - 1));
  }
}
