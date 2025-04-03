// src/modules/statistics/services/player-stats.service.ts
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

// Dentro de PlayerStatsService

private async getDailyStats(serverId: string): Promise<any[]> {
    try {
      const hours = ['24', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'];
      const results = [];
  
      // Usar raw query para obtener los datos del día actual
      const query = `
        SELECT 
          hour_24, hour_22, hour_20, hour_18, hour_16, hour_14, 
          hour_12, hour_10, hour_8, hour_6, hour_4, hour_2
        FROM 
          daily_player_data
        WHERE 
          server_id = ?
          AND date = CURDATE()
      `;
      
      const [data] = await this.dailyPlayerDataRepository.query(query, [serverId]);
      
      if (data) {
        // Transformar los datos a la estructura requerida
        for (const hour of hours) {
          results.push({
            day: 1,
            hour: hour,
            Jugadores: data[`hour_${hour}`] !== undefined ? data[`hour_${hour}`] : -1
          });
        }
      }
  
      // Ordenar los resultados según el orden especificado de horas
      results.sort((a, b) => {
        return hours.indexOf(a.hour) - hours.indexOf(b.hour);
      });
  
      return results;
    } catch (error) {
      this.logger.error(`Error getting daily stats for server ${serverId}: ${error.message}`);
      return [];
    }
  }
  
  private async getPeriodStats(serverId: string, days: number): Promise<any[]> {
    try {
      const hours = ['24', '18', '12', '6'];
      
      // Construir la consulta SQL personalizada
      const query = `
        WITH date_range AS (
          SELECT CURDATE() - INTERVAL n DAY AS date_val
          FROM (
            SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 
            UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
            UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
            UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
            UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
            UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23
            UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27
            UNION SELECT 28 UNION SELECT 29
          ) nums
          WHERE n < ${days}
        )
        
        SELECT 
          DATEDIFF(dpd.date, CURDATE() - INTERVAL ${days-1} DAY) + 1 AS day,
          hour.hour_val AS hour,
          CASE 
            WHEN hour.hour_val = '24' THEN dpd.hour_24
            WHEN hour.hour_val = '18' THEN dpd.hour_18
            WHEN hour.hour_val = '12' THEN dpd.hour_12
            WHEN hour.hour_val = '6' THEN dpd.hour_6
            ELSE -1
          END AS Jugadores
        FROM 
          daily_player_data dpd
        CROSS JOIN (
          SELECT '24' AS hour_val
          UNION SELECT '18'
          UNION SELECT '12'
          UNION SELECT '6'
        ) hour
        WHERE 
          dpd.server_id = ${serverId}
          AND dpd.date >= CURDATE() - INTERVAL ${days-1} DAY
          AND dpd.date <= CURDATE()
        
        ORDER BY 
          day, 
          FIELD(hour, '24', '18', '12', '6')
      `;
      
      // Ejecutar la consulta
      const results = await this.dailyPlayerDataRepository.query(query);
      
      // Filtrar resultados con valores válidos
      return results.filter(item => item.Jugadores !== null && item.Jugadores > -1);
    } catch (error) {
      this.logger.error(`Error getting period stats for server ${serverId}: ${error.message}`);
      return [];
    }
  }
}