// src/modules/servers/dto/server.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddServerDto {
  @ApiProperty({ description: 'Server host:port address' })
  @IsString()
  @IsNotEmpty()
  host: string;
}

export class GetServersQueryDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  map?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  varKey?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  varValue?: string;

  @ApiProperty({ required: false, default: 'numplayers' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({ required: false, default: 'true' })
  @IsOptional()
  orderDirection?: string;
}

export class ServerInfoDto {
  @ApiProperty({ required: true })
  @IsString()
  host: string;

  @ApiProperty({ required: true })
  @IsString()
  port: string;
}

export class ServerPlayersQueryDto {
  @ApiProperty({ required: true })
  @IsString()
  id: string;

  @ApiProperty({ required: false, default: '0' })
  @IsOptional()
  @IsString()
  type?: string;
}

export class ServerResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  host: string;

  @ApiProperty()
  port: number;

  @ApiProperty()
  servername: string;

  @ApiProperty()
  map: string;

  @ApiProperty()
  maxplayers: number;

  @ApiProperty()
  numplayers: number;

  @ApiProperty()
  rank_id: number;

  @ApiProperty()
  status: number;

  @ApiProperty({ required: false })
  last_update?: string;

  @ApiProperty({ required: false })
  percentile?: number;

  @ApiProperty({ required: false })
  monthly_avg?: number;

  @ApiProperty({ required: false })
  ServerRanks?: any;

  @ApiProperty({ required: false })
  WeeklyMapData?: any;
}