// src/modules/players/controllers/player.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlayersService } from '../services/players.service';
import { GetPlayerQueryDto } from '../dto/player.dto';

@ApiTags('players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('getPlayer')
  @ApiOperation({ summary: 'Get players with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Players retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPlayer(@Query() query: GetPlayerQueryDto) {
    return this.playersService.getPlayers(query);
  }
}