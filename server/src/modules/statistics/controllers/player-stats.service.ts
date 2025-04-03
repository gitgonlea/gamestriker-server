import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyPlayerData } from '../entities/daily-player-data.entity';
import { PlayerStatsQueryDto } from '../dto/player-stats.dto';

@Injectable()
export class PlayerStatsService {
  private readonly logger = new Logger(PlayerStatsService.name);

  constructor(
    @InjectRepository(DailyPlayerData)
    private readonly dailyPlayerDataRepository: Repository<DailyPlayerData>,
  ) {}

  async getPlayerStats(query: PlayerStatsQueryDto): Promise<any[]> {
    try {
      const { type, server_id } = query;

      if (type !== '0') {
        // Datos para periodos (semanal, mensual)
        return this.getPeriodStats(server_id, type === '1' ? 7 : 30);
      } else {
        // Datos para periodo diario
        return this.getDailyStats(server_id);
      }
    } catch (error) {
      this.logger.error(`Error retrieving player stats: ${error.message}`);
      throw error;
    }
  }

  private async getDailyStats(serverId: string): Promise<any[]> {
    try {
      const hours = ['24', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'];
      const results = [];

      // Usar consulta SQL directa en lugar de ORM para utilizar CURDATE()
      const rawQuery = `
        SELECT 
          hour_24, hour_22, hour_20, hour_18, hour_16, hour_14, 
          hour_12, hour_10, hour_8, hour_6, hour_4, hour_2
        FROM 
          daily_player_data
        WHERE 
          server_id = ?
          AND date = CURDATE()
      `;
      
      const [data] = await this.dailyPlayerDataRepository.query(rawQuery, [serverId]);
      
      if (data) {
        for (const hour of hours) {
          results.push({
            day: 1,
            hour,
            Jugadores: data[`hour_${hour}`] !== undefined ? data[`hour_${hour}`] : -1
          });
        }
      }

      // Ordenar por hora según el orden del array 'hours'
      results.sort((a, b) => {
        return hours.indexOf(a.hour) - hours.indexOf(b.hour);
      });

      return results;
    } catch (error) {
      this.logger.error(`Error getting daily stats: ${error.message}`);
      return [];
    }
  }

  private async getPeriodStats(serverId: string, days: number): Promise<any[]> {
    try {
      const hours = ['24', '18', '12', '6'];
      
      // La implementación actual ya usa consultas SQL directas, 
      // así que no necesita cambios para solucionar el problema de tipo Date
      const repeatedParts = [];
      
      // Construir partes de consulta repetidas
      let repeatedPart = '';
      for (let i = 0; i < days; i++) {
        if (i === days - 1) {
          repeatedPart += `WHEN date = CURDATE() THEN '${i + 1}'`;
        } else {
          repeatedPart += `WHEN date = CURDATE() - INTERVAL ${days - i - 1} DAY THEN '${i + 1}'`;
        }
      }

      // Construir consulta completa para todas las horas
      for (const hour of hours) {
        repeatedParts.push(`
          SELECT 
            CASE ${repeatedPart} END AS day,
            '${hour}' AS hour,
            hour_${hour} AS Jugadores
          FROM 
            daily_player_data
          WHERE 
            date >= CURDATE() - INTERVAL ${days} DAY 
            AND date <= CURDATE()
            AND server_id = ${serverId}
        `);
      }

      // Ejecutar consulta
      const query = repeatedParts.join(' UNION ALL ') + 
        " ORDER BY day, FIELD(hour, '24', '22', '20', '18', '16', '14', '12', '10', '8', '6', '4', '2');";
      
      const result = await this.dailyPlayerDataRepository.query(query);

      return result;
    } catch (error) {
      this.logger.error(`Error getting period stats: ${error.message}`);
      return [];
    }
  }
}