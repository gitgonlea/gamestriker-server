// src/modules/gameserver/services/gameserver.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SourceQuery from 'sourcequery';
import { ServerInfo } from '../interfaces/server-info.interface';
import { PlayerInfo } from '../interfaces/player-info.interface';

@Injectable()
export class GameServerService {
  private readonly logger = new Logger(GameServerService.name);
  private readonly timeout: number;

  constructor(private configService: ConfigService) {
    this.timeout = this.configService.get<number>('server.queryTimeout') || 1000;
  }

  /**
   * Query a Counter-Strike 1.6 server for basic information
   */
  async queryServer(host: string, port: number): Promise<ServerInfo | null> {
    const sq = new SourceQuery(this.timeout);

    try {
      sq.open(host, port);
      
      const info = await new Promise<any>((resolve, reject) => {
        sq.getInfo((err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });
      
      return {
        name: info.name,
        map: info.map,
        maxplayers: info.maxplayers,
        players: info.players,
        bots: info.bots || 0,
        password: !!info.password,
        version: info.version,
        ping: 0, // SourceQuery doesn't provide ping in the same way
        connect: `${host}:${port}`,
        raw: info
      };
    } catch (error) {
      this.logger.error(`Error querying server ${host}:${port}: ${error.message || error}`);
      return null;
    } finally {
      sq.close();
    }
  }

  /**
   * Query a Counter-Strike 1.6 server for player information
   */
  async queryServerPlayers(host: string, port: number): Promise<PlayerInfo[]> {
    const sq = new SourceQuery(this.timeout);

    try {
      sq.open(host, port);
      
      const players = await new Promise<any[]>((resolve, reject) => {
        sq.getPlayers((err, players) => {
          if (err) return reject(err);
          resolve(players || []);
        });
      });
      
      // Convert SourceQuery players to our PlayerInfo format
      return players.map(player => ({
        name: player.name,
        score: player.score || 0,
        online: player.time || 0, // Time in seconds
        raw: player
      }));
    } catch (error) {
      this.logger.error(`Error querying players from server ${host}:${port}: ${error.message || error}`);
      return [];
    } finally {
      sq.close();
    }
  }
}