// src/modules/statistics/dto/player-stats.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PlayerStatsQueryDto {
  @ApiProperty({ description: 'Type of stats: 0 = Daily, 1 = Weekly, 2 = Monthly' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Server ID' })
  @IsString()
  @IsNotEmpty()
  server_id: string;
}
