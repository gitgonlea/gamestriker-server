// src/modules/gameserver/gameserver.module.ts
import { Module } from '@nestjs/common';
import { GameServerService } from './services/gameserver.service';
import { ServerVariablesService } from './services/server-variables.service';

@Module({
  providers: [GameServerService, ServerVariablesService],
  exports: [GameServerService, ServerVariablesService],
})
export class GameServerModule {}