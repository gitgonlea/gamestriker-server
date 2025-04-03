// src/modules/statistics/statistics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerStatsController } from './controllers/player-stats.controller';
import { RankStatsController } from './controllers/rank-stats.controller';
import { PlayerStatsService } from './services/player-stats.service';
import { RankStatsService } from './services/rank-stats.service';
import { DailyMapData } from './entities/daily-map-data.entity';
import { DailyPlayerData } from './entities/daily-player-data.entity';
import { DailyRanksData } from './entities/daily-ranks-data.entity';
import { WeeklyMapData } from './entities/weekly-map-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyMapData,
      DailyPlayerData,
      DailyRanksData,
      WeeklyMapData,
    ]),
  ],
  controllers: [PlayerStatsController, RankStatsController],
  providers: [PlayerStatsService, RankStatsService],
  exports: [PlayerStatsService, RankStatsService],
})
export class StatisticsModule {}