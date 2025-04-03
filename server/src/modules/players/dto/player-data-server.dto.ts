// src/modules/players/dto/player-data-server.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class PlayerDataServerDto {
  @ApiProperty({ description: 'Player name' })
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @ApiProperty({ description: 'Server host' })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({ description: 'Server port' })
  @IsString()
  @IsNotEmpty()
  port: string;

  @ApiProperty({ description: 'Number of days to fetch', required: false })
  @IsOptional()
  @IsString()
  days?: string;
}