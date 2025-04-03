import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RankStatsQueryDto {
  @ApiProperty({ description: 'Server ID' })
  @IsString()
  @IsNotEmpty()
  server_id: string;
}