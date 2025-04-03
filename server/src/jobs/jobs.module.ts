// src/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateServersJob } from './update-servers.job';
import { UpdateRanksJob } from './update-ranks.job';
import { WeeklyMapDataJob } from './weekly-map-data.job';
import { SaveServerVariablesJob } from './save-server-variables.job';
import { ServersModule } from '../modules/servers/servers.module';
import { PlayersModule } from '../modules/players/players.module';
import { StatisticsModule } from '../modules/statistics/statistics.module';
import { RealtimeModule } from '../modules/realtime/realtime.module';
import { Server } from '../modules/servers/entities/server.entity';
import { PlayerData } from '../modules/players/entities/player-data.entity';
import { DailyRanksData } from '../modules/statistics/entities/daily-ranks-data.entity';
import { ServerRank } from '../modules/servers/entities/server-rank.entity';
import { DailyMapData } from '../modules/statistics/entities/daily-map-data.entity';
import { WeeklyMapData } from '../modules/statistics/entities/weekly-map-data.entity';
import { DailyServerVariables } from '../modules/servers/entities/daily-server-variables.entity';
import { GameServerModule } from '../modules/gameserver/gameserver.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Server, 
      PlayerData,
      DailyRanksData,
      ServerRank,
      DailyMapData,
      WeeklyMapData,
      DailyServerVariables
    ]),
    ServersModule,
    PlayersModule,
    StatisticsModule,
    RealtimeModule,
    GameServerModule
  ],
  providers: [
    UpdateServersJob,
    UpdateRanksJob,
    WeeklyMapDataJob,
    SaveServerVariablesJob
  ],
})
export class JobsModule {}