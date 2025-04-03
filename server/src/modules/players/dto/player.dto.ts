// src/modules/players/dto/player.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPlayerQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, default: 'online' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({ required: false, default: 'true' })
  @IsOptional()
  @IsString()
  orderDirection?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  online?: string;
}