// src/modules/players/players.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './controllers/player-controller';
import { PlayerDataServerController } from './controllers/player-data-server.controller';
import { PlayersService } from './services/players.service';
import { PlaytimeService } from './services/playtime.service';
import { PlayerData } from './entities/player-data.entity';
import { DailyPlayerTimeServerData } from './entities/daily-player-time-server-data.entity';
import { DailyPlayerScoreServerData } from './entities/daily-player-score-server-data.entity';
import { GameServerModule } from '../gameserver/gameserver.module';
import { Server } from '../servers/entities/server.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlayerData,
      DailyPlayerTimeServerData,
      DailyPlayerScoreServerData,
      Server,
    ]),
    GameServerModule,
  ],
  controllers: [PlayerController, PlayerDataServerController],
  providers: [PlayersService, PlaytimeService],
  exports: [PlayersService, PlaytimeService],
})
export class PlayersModule {}