// src/modules/players/controllers/player-data-server.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlayersService } from '../services/players.service';
import { PlayerDataServerDto } from '../dto/player-data-server.dto';

@ApiTags('players')
@Controller('players')
export class PlayerDataServerController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('getPlayerDataServer')
  @ApiOperation({ summary: 'Get detailed player data for a specific server' })
  @ApiResponse({ status: 200, description: 'Player data retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPlayerDataServer(@Query() query: PlayerDataServerDto) {
    return this.playersService.getPlayerDataServer(query);
  }
}