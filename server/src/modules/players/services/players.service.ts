// src/modules/players/services/players.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PlayerData } from '../entities/player-data.entity';
import { DailyPlayerTimeServerData } from '../entities/daily-player-time-server-data.entity';
import { DailyPlayerScoreServerData } from '../entities/daily-player-score-server-data.entity';
import { GetPlayerQueryDto } from '../dto/player.dto';
import { PlayerDataServerDto } from '../dto/player-data-server.dto';
import { Server } from '../../servers/entities/server.entity';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectRepository(PlayerData)
    private readonly playerDataRepository: Repository<PlayerData>,
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>, // Cambia esto
    @InjectRepository(DailyPlayerTimeServerData)
    private readonly dailyPlayerTimeRepository: Repository<DailyPlayerTimeServerData>,
    @InjectRepository(DailyPlayerScoreServerData)
    private readonly dailyPlayerScoreRepository: Repository<DailyPlayerScoreServerData>,
    // otros servicios
  ) {}

  async getPlayers(query: GetPlayerQueryDto): Promise<{ players: any[]; totalPages: number }> {
    const { page = 1, pageSize = 10, name, orderBy = 'online', orderDirection, online } = query;
    
    const offset = (page - 1) * pageSize;
    const isDesc = orderDirection !== 'false';

    // Build query conditions
    const whereConditions: any = {};
    
    if (name) {
      whereConditions.player_name = Like(`%${name}%`);
    }
    
    if (online === 'true') {
      whereConditions.online = 1;
    }
    
    // Determine order field
    let orderField = 'online';
    if (orderBy === 'name') {
      orderField = 'player_name';
    } else if (orderBy === 'time') {
      orderField = 'playtime';
    }
    
    try {
      // Get total count and paginated data
      const [players, total] = await this.playerDataRepository.findAndCount({
        where: whereConditions,
        relations: ['server'],
        order: { [orderField]: isDesc ? 'DESC' : 'ASC' },
        skip: offset,
        take: pageSize,
      });
      
      // Format data for response
      const formattedPlayers = players.map(player => {
        const { server, ...playerData } = player;
        return {
          ...playerData,
          servername: server?.servername,
          host: server?.host,
          port: server?.port,
        };
      });
      
      return {
        players: formattedPlayers,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      this.logger.error(`Error fetching players: ${error.message}`);
      throw error;
    }
  }

  // Método para actualizar el tiempo de juego de los jugadores
  async updatePlayTime(serverId: number): Promise<void> {
    // Implementación del método updatePlayTime
    // ...
  }

  // En src/modules/players/services/players.service.ts, añade este método

async getPlayerDataServer(query: PlayerDataServerDto): Promise<any> {
  try {
    const { playerName, host, port, days = '0' } = query;
    
    // Construir una consulta SQL nativa para obtener los datos del jugador
    // Esto es similar a tu implementación original pero usando TypeORM
    const playerData = await this.playerDataRepository.query(`
      SELECT 
          pd.*,
          s.host,
          s.port,
          s.servername,
          s.status,
          dense_rank_with_filter.rank_id AS rank_id,
          total_ranks.total_ranks_count AS rank_total
      FROM 
          player_data pd
      JOIN 
          servers s ON pd.server_id = s.id
      JOIN 
          (SELECT 
               player_name,
               DENSE_RANK() OVER (ORDER BY playtime DESC) AS rank_id
           FROM 
               player_data
           WHERE 
               server_id = (
                   SELECT id
                   FROM servers
                   WHERE host = ? AND port = ?
               )
          ) AS dense_rank_with_filter
      ON 
          pd.player_name = dense_rank_with_filter.player_name
      CROSS JOIN 
          (SELECT COUNT(*) AS total_ranks_count 
           FROM player_data 
           WHERE server_id = (
                   SELECT id
                   FROM servers
                   WHERE host = ? AND port = ?
               )
          ) AS total_ranks
      WHERE 
       s.host = ? AND s.port = ? AND pd.player_name = ?;
    `, [host, port, host, port, host, port, playerName]);
    
    // Obtener el server_id del primer resultado para usarlo en las siguientes consultas
    if (!playerData || playerData.length === 0) {
      return { player_data: [], player_time: [], player_score: [] };
    }
    
    const serverId = playerData[0].server_id;
    
    // Obtener datos de tiempo de juego diario
    const playerTime = await this.getDailyPlayerData(0, serverId, playerName, days);
    
    // Obtener datos de puntuación diaria
    const playerScore = await this.getDailyPlayerData(1, serverId, playerName, days);
    
    return { 
      player_data: playerData,
      player_time: playerTime,
      player_score: playerScore
    };
  } catch (error) {
    this.logger.error(`Error fetching player data: ${error.message}`);
    throw error;
  }
}

private async getDailyPlayerData(type: number, serverId: number, playerName: string, days: string): Promise<any[]> {
  try {
    let result = [];
    
    if (days === '0') {
      // Datos por hora para el día actual
      const hours = ['24', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
      const repository = type === 0 ? this.dailyPlayerTimeRepository : this.dailyPlayerScoreRepository;
      
      // Crear consultas para cada hora
      const queryParams = [];
      const queryParts = [];
      
      hours.forEach(hour => {
        queryParts.push(`
          SELECT 
              CASE WHEN date = CURDATE() THEN 1 END AS day,
              '${hour}' AS hour,
              ${type ? 'hour_' + hour : 'ROUND(hour_' + hour + ' / 60)'} AS ${type ? 'Puntaje' : 'Tiempo'}
          FROM 
              ${type ? 'daily_player_score_server_data' : 'daily_player_time_server_data'}
          WHERE 
              date = CURDATE()
              AND server_id = ?
              AND player_name = ?
              AND hour_${hour} != -1
        `);
        queryParams.push(serverId, playerName);
      });
      
      // Ejecutar la consulta combinada
      result = await repository.query(queryParts.join(' UNION ALL '), queryParams);
    } else {
      // Datos agregados por día
      const repository = type === 0 ? this.dailyPlayerTimeRepository : this.dailyPlayerScoreRepository;
      
      // Construir la consulta para datos agregados por día
      const hourColumns = Array.from({ length: 24 }, (_, i) => `hour_${i + 1}`);
      const hourColumnsList = hourColumns.map(hour => `CASE WHEN ${hour} != -1 THEN ${hour} ELSE 0 END`).join(' + ');
      
      const query = `
        SELECT 
            DAY(date) AS day,
            (${hourColumnsList}) AS ${type ? 'Puntaje' : 'Tiempo'}
        FROM 
            ${type ? 'daily_player_score_server_data' : 'daily_player_time_server_data'}
        WHERE 
            server_id = ?
            AND player_name = ?;
      `;
      
      result = await repository.query(query, [serverId, playerName]);
    }
    
    return [result];
  } catch (error) {
    this.logger.error(`Error retrieving daily player data: ${error.message}`);
    return [[]];
  }
}
}