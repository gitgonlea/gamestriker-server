// src/modules/players/services/playtime.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as moment from 'moment-timezone';
import { PlayerData } from '../entities/player-data.entity';
import { DailyPlayerTimeServerData } from '../entities/daily-player-time-server-data.entity';
import { DailyPlayerScoreServerData } from '../entities/daily-player-score-server-data.entity';
import { GameServerService } from '../../gameserver/services/gameserver.service'; // Corregido el nombre del módulo
import { Server } from '../../servers/entities/server.entity';

@Injectable()
export class PlaytimeService {
  private readonly logger = new Logger(PlaytimeService.name);

  constructor(
    @InjectRepository(PlayerData)
    private readonly playerDataRepository: Repository<PlayerData>,
    @InjectRepository(DailyPlayerTimeServerData)
    private readonly dailyPlayerTimeRepository: Repository<DailyPlayerTimeServerData>,
    @InjectRepository(DailyPlayerScoreServerData)
    private readonly dailyPlayerScoreRepository: Repository<DailyPlayerScoreServerData>,
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    private readonly gameServerService: GameServerService,
  ) {}

  async updatePlayTime(serverId: number): Promise<void> {
    try {
      // Get server information
      const server = await this.serverRepository.findOne({ where: { id: serverId } });
      if (!server) {
        throw new Error(`Server with id ${serverId} not found`);
      }

      // Mark all players offline initially
      await this.playerDataRepository.update(
        { server_id: serverId },
        { online: 0 }
      );

      // Query player data from the game server
      const playerData = await this.gameServerService.queryServerPlayers(server.host, server.port);
      if (!playerData || playerData.length === 0) {
        return;
      }

      // Get the existing player data for all players currently on the server
      const playerNames = playerData.map(player => player.name);
      const existingPlayers = await this.playerDataRepository.find({
        where: {
          server_id: serverId,
          player_name: In(playerNames), // Usar In() para buscar coincidencias múltiples
        },
      });

      // Create a map for quick lookup
      const existingPlayerMap = existingPlayers.reduce((map, player) => {
        map[player.player_name] = player;
        return map;
      }, {});

      // Process each player
      for (const player of playerData) {
        await this.processPlayerData(serverId, player, existingPlayerMap);
      }
    } catch (error) {
      this.logger.error(`Error updating play time for server ${serverId}: ${error.message}`);
    }
  }

  private async processPlayerData(serverId: number, playerInfo: any, existingPlayerMap: any): Promise<void> {
    try {
      const playerName = playerInfo.name;
      const currentPlaytime = playerInfo.online;
      const currentScore = playerInfo.score;

      // Get existing player data or create defaults
      const existingPlayer = existingPlayerMap[playerName] || {
        playtime: 0,
        score: 0,
        previous_playtime: 0,
        previous_score: 0,
        last_seen: null
      };

      const currentTime = new Date();
      const lastSeenTime = existingPlayer.last_seen ? new Date(existingPlayer.last_seen) : null;

      let playtimeDifference = 0;
      let scoreDifference = 0;

      // Calculate playtime only if last seen is recent (less than 16 minutes ago)
      if (lastSeenTime && (currentTime.getTime() - lastSeenTime.getTime()) / (1000 * 60) < 16) {
        if (currentPlaytime >= existingPlayer.previous_playtime) {
          playtimeDifference = currentPlaytime - existingPlayer.previous_playtime;
        }
      } else {
        // Player was not seen recently, assume this is a new session
        playtimeDifference = currentPlaytime;
      }

      // Calculate score difference
      if (currentScore >= existingPlayer.previous_score) {
        scoreDifference = currentScore - existingPlayer.previous_score;
      } else {
        // Score reset (e.g., new map), count current score
        scoreDifference = currentScore;
      }

      const newPlaytime = existingPlayer.playtime + playtimeDifference;
      const newScore = existingPlayer.score + scoreDifference;

      // Upsert player data
      await this.playerDataRepository.upsert({
        server_id: serverId,
        player_name: playerName,
        playtime: newPlaytime,
        score: newScore,
        online: 1,
        last_seen: new Date(),
        current_playtime: currentPlaytime,
        current_score: currentScore,
        previous_playtime: currentPlaytime,
        previous_score: currentScore,
        BOT: playerName.includes('BOT') ? 1 : 0
      }, {
        conflictPaths: ['server_id', 'player_name']
      });

      // Update daily statistics
      await this.updateDailyPlayerData(serverId, 0, newPlaytime, playerName); // Para tiempo
      await this.updateDailyPlayerData(serverId, 1, newScore, playerName);    // Para puntuación
    } catch (error) {
      this.logger.error(`Error processing player data: ${error.message}`);
    }
  }

  private async updateDailyPlayerData(serverId: number, type: number, value: number, playerName: string): Promise<void> {
    try {
      const currentDate = moment().tz('America/Argentina/Buenos_Aires');
      const currentHour = currentDate.hours();

      // Solo actualizar para las horas que rastreamos
      if (![24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].includes(currentHour)) {
        return;
      }

      // Seleccionar el repositorio correcto según el tipo (0 = tiempo, 1 = puntuación)
      const repository = type === 0 ? this.dailyPlayerTimeRepository : this.dailyPlayerScoreRepository;
      const tableName = type === 0 ? 'daily_player_time_server_data' : 'daily_player_score_server_data';

      // Usar una consulta SQL directa para actualizar o insertar con valores para la hora actual
      const query = `
        INSERT INTO ${tableName} 
          (server_id, player_name, date, hour_${currentHour})
        VALUES 
          (?, ?, CURDATE(), ?)
        ON DUPLICATE KEY UPDATE 
          hour_${currentHour} = VALUES(hour_${currentHour})
      `;

      await repository.query(query, [serverId, playerName, value]);
    } catch (error) {
      this.logger.error(`Error updating daily player ${type ? 'score' : 'time'} data: ${error.message}`);
    }
  }
}