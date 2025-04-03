import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyRanksData } from '../entities/daily-ranks-data.entity';
import { RankStatsQueryDto } from '../dto/rank-stats.dto';

@Injectable()
export class RankStatsService {
  private readonly logger = new Logger(RankStatsService.name);

  constructor(
    @InjectRepository(DailyRanksData)
    private readonly dailyRanksDataRepository: Repository<DailyRanksData>,
  ) {}

  async getRankStats(query: RankStatsQueryDto): Promise<any[]> {
    try {
      const rawQuery = `
        SELECT 
          date, rank_id as "Rank"
        FROM 
          daily_ranks_data
        WHERE 
          server_id = ?
          AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ORDER BY 
          date ASC
      `;
      
      const rankStats = await this.dailyRanksDataRepository.query(rawQuery, [query.server_id]);
      
      return rankStats;
    } catch (error) {
      this.logger.error(`Error retrieving rank stats: ${error.message}`);
      throw error;
    }
  }  
}