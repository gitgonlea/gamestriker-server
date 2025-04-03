// src/modules/statistics/controllers/rank-stats.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankStatsService } from '../services/rank-stats.service';
import { RankStatsQueryDto } from '../dto/rank-stats.dto';

@ApiTags('statistics')
@Controller('statistics')
export class RankStatsController {
  constructor(private readonly rankStatsService: RankStatsService) {}

  @Get('getRankStats')
  @ApiOperation({ summary: 'Get rank statistics for a server' })
  @ApiResponse({ status: 200, description: 'Rank statistics retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getRankStats(@Query() query: RankStatsQueryDto) {
    return this.rankStatsService.getRankStats(query);
  }
}