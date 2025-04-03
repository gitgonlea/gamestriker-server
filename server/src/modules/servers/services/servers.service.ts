// src/modules/servers/services/servers.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as moment from 'moment-timezone';
import { ServerRepository } from '../repositories/server.repository';
import { GameServerService } from '../../gameserver/services/gameserver.service';
import { BannerService } from './banner.service';
import { Server } from '../entities/server.entity';
import { ServerRank } from '../entities/server-rank.entity';
import { DailyPlayerData } from '../../statistics/entities/daily-player-data.entity';
import { DailyMapData } from '../../statistics/entities/daily-map-data.entity';
import { WeeklyMapData } from '../../statistics/entities/weekly-map-data.entity';
import { DailyServerVariables } from '../entities/daily-server-variables.entity';
import { PlayerData } from '../../players/entities/player-data.entity';
import { AddServerDto, GetServersQueryDto, ServerInfoDto, ServerPlayersQueryDto } from '../dto/server.dto';
import { ServerVariablesService } from '../../gameserver/services/server-variables.service';
import { PlayersService } from '../../players/services/players.service';

@Injectable()
export class ServersService {
  private readonly logger = new Logger(ServersService.name);

  constructor(
    private readonly serverRepository: ServerRepository,
    private readonly gameServerService: GameServerService,
    private readonly serverVariablesService: ServerVariablesService,
    private readonly bannerService: BannerService,
    private readonly playersService: PlayersService,
    @InjectRepository(ServerRank)
    private serverRanksRepository: Repository<ServerRank>,
    @InjectRepository(DailyPlayerData)
    private dailyPlayerDataRepository: Repository<DailyPlayerData>,
    @InjectRepository(DailyMapData)
    private dailyMapDataRepository: Repository<DailyMapData>,
    @InjectRepository(WeeklyMapData)
    private weeklyMapDataRepository: Repository<WeeklyMapData>,
    @InjectRepository(DailyServerVariables)
    private dailyServerVariablesRepository: Repository<DailyServerVariables>,
    @InjectRepository(PlayerData)
    private playerDataRepository: Repository<PlayerData>,
    @InjectRepository(Server)
    private readonly serverRepo: Repository<Server>,
  ) {}

  async addServer(addServerDto: AddServerDto): Promise<any> {
    try {
      const [ip, portStr] = addServerDto.host.split(':');
      const port = parseInt(portStr, 10);

      const state = await this.gameServerService.queryServer(ip, port);

      if (!state) {
        return 'fail';
      }

      // Check if server already exists
      const existingServer = await this.serverRepository.findByHostAndPort(ip, port);
      if (existingServer) {
        return 'duplicated';
      }

      // Create server record
      const serverData = {
        host: ip,
        port: port,
        servername: state.name,
        map: state.map,
        maxplayers: state.maxplayers,
        numplayers: state.players
      };

      const server = await this.serverRepository.create(serverData);
      
      // Update rank_id to be same as id initially
      await this.serverRepository.update(server.id, { rank_id: server.id });
      
      // Create initial player stats data for banner generation
      const playerStatsFake = [
        { day: 1, hour: '24', Jugadores: 0 },
        { day: 1, hour: '6', Jugadores: 0 }
      ];
      
      // Generate banner
      await this.bannerService.generateBanner({
        ...serverData,
        rank_id: server.id,
        online: 1
      }, playerStatsFake);
      
      return serverData;
    } catch (error) {
      this.logger.error(`Error adding server: ${error.message}`);
      throw error;
    }
  }

  async getServers(query: GetServersQueryDto): Promise<{ servers: Server[]; totalPages: number }> {
    try {
      // If we have varKey, we need a special query with the JSON functions
      if (query.varKey) {
        return await this.getServersWithVariables(query);
      }
      
      // Otherwise use the repository method
      return await this.serverRepository.findAll({
        page: query.page,
        pageSize: query.pageSize,
        name: query.name,
        map: query.map,
        ip: query.ip,
        orderBy: query.orderBy,
        orderDirection: query.orderDirection === 'true',
      });
    } catch (error) {
      this.logger.error(`Error fetching servers: ${error.message}`);
      throw error;
    }
  }

  private async getServersWithVariables(query: GetServersQueryDto): Promise<{ servers: Server[]; totalPages: number }> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 5;
    const orderBy = query.orderBy || 'numplayers';
    const orderDirection = query.orderDirection === 'false' ? 'ASC' : 'DESC';
    
    // Usar serverRepo en lugar de serverRepository porque el método createQueryBuilder está en Repository, no en ServerRepository
    const qb = this.serverRepo.createQueryBuilder('s')
      .innerJoin('daily_server_variables', 'dsv', 's.id = dsv.server_id');
      
    if (query.varValue) {
      qb.where(`JSON_EXTRACT(dsv.variables_data, '$.${query.varKey}') = :varValue`, {
        varValue: query.varValue,
      });
    } else {
      qb.where(`JSON_CONTAINS_PATH(dsv.variables_data, 'one', :jsonKey)`, {
        jsonKey: `$.${query.varKey}`,
      });
    }
    
    // Add ordering
    qb.addOrderBy(`CASE WHEN s.map = 'Desconocido' THEN 1 ELSE 0 END`, 'ASC')
      .addOrderBy(`s.${orderBy}`, orderDirection)
      .skip((page - 1) * pageSize)
      .take(pageSize);
    
    const [servers, total] = await qb.getManyAndCount();
    
    return {
      servers,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getServerInfo(query: ServerInfoDto): Promise<Server[]> {
    try {
      // Validate and parse the port parameter
      const portValue = parseInt(query.port, 10);
      
      // Check if port parsing resulted in NaN
      if (isNaN(portValue)) {
        this.logger.error(`Invalid port value: ${query.port}`);
        throw new Error(`Invalid port value: ${query.port}`);
      }
      
      // Use the validated numeric port value
      const server = await this.serverRepository.findByHostAndPort(query.host, portValue);
      
      if (!server) {
        throw new NotFoundException('Server not found');
      }
      
      // Get server ranks
      const serverRanks = await this.serverRanksRepository.findOne({
        where: { server_id: server.id }
      });
      
      // Get weekly map data
      const weeklyMapData = await this.weeklyMapDataRepository.findOne({
        where: { server_id: server.id }
      });
      
      // Add rank percentile
      const rankCount = await this.serverRepository.countByRank(server.rank_id);
      const serverCount = await this.serverRepository.count();
      const percentile = Math.round((rankCount / serverCount) * 100);
      
      // Get monthly average players
      const monthlyAvgPlayers = await this.dailyPlayerDataRepository
        .createQueryBuilder()
        .select('((hour_24 + hour_18 + hour_12 + hour_6) / 4)', 'avg')
        .where('server_id = :serverId', { serverId: server.id })
        .getRawOne();
      
      // Prepare the response
      const response: any = {
        ...server,
        percentile,
        monthly_avg: monthlyAvgPlayers ? Math.round(monthlyAvgPlayers.avg) : -1,
      };
      
      // Add server ranks if available
      if (serverRanks) {
        response.ServerRanks = [serverRanks];
      } else {
        response.ServerRanks = [{ lowest_rank: 0, highest_rank: 0 }];
      }
      
      // Add weekly map data if available
      if (weeklyMapData && weeklyMapData.map_data) {
        try {
          response.WeeklyMapData = [
            { map_data: JSON.parse(weeklyMapData.map_data) }
          ];
        } catch (e) {
          response.WeeklyMapData = [{ map_data: {} }];
        }
      } else {
        response.WeeklyMapData = [{ map_data: {} }];
      }
      
      return [response];
    } catch (error) {
      this.logger.error(`Error fetching server info: ${error.message}`);
      throw error;
    }
  }

  async getServerPlayers(query: ServerPlayersQueryDto): Promise<PlayerData[]> {
    try {
      if (query.type === '1') {
        // Online players
        return this.playerDataRepository.find({
          where: {
            online: 1,
            server_id: parseInt(query.id, 10)
          },
          order: {
            current_score: 'DESC'
          }
        });
      } else {
        // Top 10 players
        return this.playerDataRepository.find({
          where: {
            server_id: parseInt(query.id, 10),
            BOT: 0
          },
          order: {
            score: 'DESC'
          },
          take: 10
        });
      }
    } catch (error) {
      this.logger.error(`Error fetching server players: ${error.message}`);
      throw error;
    }
  }

  async getServerVariables(host: string, port: string): Promise<any[]> {
    try {
      // Find the server
      const server = await this.serverRepository.findByHostAndPort(
        host, 
        parseInt(port, 10)
      );
      
      if (!server) {
        throw new NotFoundException('Server not found');
      }
      
      // Find the variables
      const variables = await this.dailyServerVariablesRepository.findOne({
        where: { server_id: server.id }
      });
      
      if (!variables) {
        throw new NotFoundException('Server variables not found');
      }
      
      // Prepare response
      const response = {
        ...variables,
        host,
        port,
        servername: server.servername
      };
      
      return [response];
    } catch (error) {
      this.logger.error(`Error fetching server variables: ${error.message}`);
      throw error;
    }
  }

  async updateServer(server: Server): Promise<void> {
    try {
      const state = await this.gameServerService.queryServer(server.host, server.port);
      
      if (state) {
        // Server is online
        const nowInBuenosAires = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
        
        // Update server info
        await this.serverRepository.update(server.id, {
          servername: state.name,
          map: state.map,
          maxplayers: state.maxplayers,
          numplayers: state.players,
          status: 1,
          last_update: nowInBuenosAires
        });
        
        // Update map data
        await this.updateDailyMapData(server.id, state.map);
        
        // Update player count data
        await this.updateDailyPlayerCount(server.id, state.players);
        
        // Update player data
        await this.playersService.updatePlayTime(server.id);
        
        // Get daily players for banner
        const dailyPlayers = await this.getDailyPlayers(server.id);
        
        // Generate banner
        await this.bannerService.generateBanner({
          servername: state.name,
          map: state.map,
          maxplayers: state.maxplayers,
          numplayers: state.players,
          host: server.host,
          port: server.port,
          rank_id: server.rank_id,
          online: 1
        }, dailyPlayers);
      } else {
        // Server is offline
        await this.setServerOffline(server);
      }
    } catch (error) {
      this.logger.error(`Error updating server ${server.id}: ${error.message}`);
      await this.setServerOffline(server);
    }
  }

  private async updateDailyMapData(serverId: number, currentMap: string): Promise<void> {
    try {
      // Usar una consulta SQL directa en lugar de ORM para utilizar CURDATE()
      const rawQuery = `
        SELECT id, map_data 
        FROM daily_map_data 
        WHERE server_id = ? 
        AND date = CURDATE()
      `;
      
      const [existingData] = await this.dailyMapDataRepository.query(rawQuery, [serverId]);
      
      if (existingData && existingData.map_data) {
        // Update existing map data
        let mapData;
        try {
          mapData = JSON.parse(existingData.map_data);
        } catch (e) {
          mapData = {};
        }
        
        if (!mapData[currentMap]) {
          mapData[currentMap] = 1;
        } else {
          mapData[currentMap]++;
        }
        
        await this.dailyMapDataRepository.update(
          { id: existingData.id },
          { map_data: JSON.stringify(mapData) }
        );
      } else {
        // Create new map data
        const initialMapData = { [currentMap]: 1 };
        const initialMapDataJson = JSON.stringify(initialMapData);
        
        // Usar consulta SQL directa para insert con CURDATE()
        const insertQuery = `
          INSERT INTO daily_map_data (server_id, map_data, date)
          VALUES (?, ?, CURDATE())
        `;
        
        await this.dailyMapDataRepository.query(insertQuery, [serverId, initialMapDataJson]);
      }
    } catch (error) {
      this.logger.error(`Error updating daily map data: ${error.message}`);
    }
  }

  private async updateDailyPlayerCount(serverId: number, players: number): Promise<void> {
    const currentDate = moment().tz('America/Argentina/Buenos_Aires');
    const currentHour = currentDate.hours();
    
    // Only update at specific hours
    if (![24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2].includes(currentHour)) {
      return;
    }
    
    // Only update in the first 10 minutes of the hour
    if (currentDate.minutes() > 10) {
      return;
    }
    
    try {
      // Usar SQL directo en lugar de TypeORM upsert con funciones
      const query = `
        INSERT INTO daily_player_data (server_id, date, hour_${currentHour})
        VALUES (?, CURDATE(), ?)
        ON DUPLICATE KEY UPDATE
        hour_${currentHour} = VALUES(hour_${currentHour})
      `;
      
      await this.dailyPlayerDataRepository.query(query, [serverId, players]);
    } catch (error) {
      this.logger.error(`Error updating daily player count: ${error.message}`);
    }
  }

  private async getDailyPlayers(serverId: number): Promise<any[]> {
    try {
      const hours = ['24', '22', '20', '18', '16', '14', '12', '10', '8', '6', '4', '2'];
      
      // Create a raw query to get the data in the format we need
      const query = hours.map(hour => 
        `SELECT 1 AS day, '${hour}' AS hour, hour_${hour} AS Jugadores 
         FROM daily_player_data 
         WHERE date = CURDATE() AND server_id = ?`
      ).join(' UNION ALL ');
      
      const result = await this.dailyPlayerDataRepository.query(
        query + " ORDER BY day, FIELD(hour, '24', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22')",
        Array(hours.length).fill(serverId)
      );
      
      return result.filter(data => data.Jugadores !== -1);
    } catch (error) {
      this.logger.error(`Error getting daily players: ${error.message}`);
      return [];
    }
  }

  private async setServerOffline(server: Server): Promise<void> {
    try {
      // Update server status
      await this.serverRepository.update(server.id, {
        status: 0,
        map: 'Desconocido',
        numplayers: 0
      });
      
      // Get daily players for banner
      const dailyPlayers = await this.getDailyPlayers(server.id);
      
      // Generate offline banner
      await this.bannerService.generateBanner({
        servername: server.servername,
        map: 'Desconocido',
        maxplayers: server.maxplayers,
        numplayers: 0,
        host: server.host,
        port: server.port,
        rank_id: server.rank_id,
        online: 0
      }, dailyPlayers);
    } catch (error) {
      this.logger.error(`Error setting server offline: ${error.message}`);
    }
  }

  async saveServerVariables(): Promise<void> {
    try {
      // Get all active servers
      const servers = await this.serverRepo.find({
        where: { status: 1 },
        select: ['id', 'host', 'port']
      });
      
      // Update variables for each server
      for (const server of servers) {
        const variables = await this.serverVariablesService.fetchServerVariables(
          server.host,
          server.port
        );
        
        if (variables) {
          await this.dailyServerVariablesRepository.upsert(
            {
              server_id: server.id,
              variables_data: variables
            },
            { conflictPaths: ['server_id'] }
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error saving server variables: ${error.message}`);
    }
  }
}