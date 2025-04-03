// src/modules/servers/servers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersController } from './controllers/servers.controller';
import { ServersService } from './services/servers.service';
import { BannerService } from './services/banner.service';
import { ServerRepository } from './repositories/server.repository';
import { Server } from './entities/server.entity';
import { ServerRank } from './entities/server-rank.entity';
import { DailyServerVariables } from './entities/daily-server-variables.entity';
import { DailyMapData } from '../statistics/entities/daily-map-data.entity';
import { DailyPlayerData } from '../statistics/entities/daily-player-data.entity';
import { WeeklyMapData } from '../statistics/entities/weekly-map-data.entity';
import { PlayerData } from '../players/entities/player-data.entity';
import { GameServerModule } from '../gameserver/gameserver.module';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Server,
      ServerRank,
      DailyServerVariables,
      DailyMapData,
      DailyPlayerData,
      WeeklyMapData,
      PlayerData,
    ]),
    GameServerModule,
    PlayersModule,
  ],
  controllers: [ServersController],
  providers: [ServersService, BannerService, ServerRepository],
  exports: [ServersService, BannerService, ServerRepository],
})
export class ServersModule {}