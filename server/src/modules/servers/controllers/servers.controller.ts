import { Controller, Get, Post, Body, Query, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServersService } from '../services/servers.service';
import { AddServerDto, GetServersQueryDto, ServerInfoDto, ServerPlayersQueryDto, ServerResponse } from '../dto/server.dto';

@ApiTags('servers')
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post('addServer')
  @ApiOperation({ summary: 'Add a new server' })
  @ApiResponse({ status: 200, description: 'Server added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async addServer(@Body() addServerDto: AddServerDto) {
    try {
      const result = await this.serversService.addServer(addServerDto);
      return result;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('getServers')
  @ApiOperation({ summary: 'Get servers with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Servers retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getServers(@Query() query: GetServersQueryDto) {
    try {
      return await this.serversService.getServers(query);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('getServerInfo')
  @ApiOperation({ summary: 'Get detailed information about a server' })
  @ApiResponse({ status: 200, description: 'Server info retrieved successfully', type: [ServerResponse] })
  @ApiResponse({ status: 404, description: 'Server not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getServerInfo(@Query() query: ServerInfoDto) {
    try {
      return await this.serversService.getServerInfo(query);
    } catch (error) {
      if (error.message === 'Server not found') {
        throw new HttpException('Server not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('getServerPlayers')
  @ApiOperation({ summary: 'Get players for a specific server' })
  @ApiResponse({ status: 200, description: 'Server players retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getServerPlayers(@Query() query: ServerPlayersQueryDto) {
    try {
      return await this.serversService.getServerPlayers(query);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('getServerVariables')
  @ApiOperation({ summary: 'Get variables for a specific server' })
  @ApiResponse({ status: 200, description: 'Server variables retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Server or variables not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getServerVariables(@Query('host') host: string, @Query('port') port: string) {
    try {
      return await this.serversService.getServerVariables(host, port);
    } catch (error) {
      if (error.message === 'Server not found' || error.message === 'Server variables not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}