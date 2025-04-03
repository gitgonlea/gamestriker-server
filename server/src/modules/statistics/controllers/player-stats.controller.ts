// src/modules/statistics/controllers/player-stats.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlayerStatsService } from '../services/player-stats.service';
import { PlayerStatsQueryDto } from '../dto/player-stats.dto';

@ApiTags('statistics')
@Controller('statistics')
export class PlayerStatsController {
  constructor(private readonly playerStatsService: PlayerStatsService) {}

  @Get('getPlayerStats')
  @ApiOperation({ summary: 'Get player statistics for a server' })
  @ApiResponse({ status: 200, description: 'Player statistics retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPlayerStats(@Query() query: PlayerStatsQueryDto) {
    return this.playerStatsService.getPlayerStats(query);
  }
}