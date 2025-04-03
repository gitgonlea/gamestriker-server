"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PlayerStatsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerStatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_player_data_entity_1 = require("../entities/daily-player-data.entity");
let PlayerStatsService = PlayerStatsService_1 = class PlayerStatsService {
    constructor(dailyPlayerDataRepository) {
        this.dailyPlayerDataRepository = dailyPlayerDataRepository;
        this.logger = new common_1.Logger(PlayerStatsService_1.name);
    }
    async getPlayerStats(query) {
        try {
            const { type, server_id } = query;
            if (type !== '0') {
                return this.getPeriodStats(server_id, type === '1' ? 7 : 30);
            }
            else {
                return this.getDailyStats(server_id);
            }
        }
        catch (error) {
            this.logger.error(`Error retrieving player stats: ${error.message}`);
            throw error;
        }
    }
    async getDailyStats(serverId) {
        try {
            const hours = ['24', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'];
            const results = [];
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
                for (const hour of hours) {
                    results.push({
                        day: 1,
                        hour: hour,
                        Jugadores: data[`hour_${hour}`] !== undefined ? data[`hour_${hour}`] : -1
                    });
                }
            }
            results.sort((a, b) => {
                return hours.indexOf(a.hour) - hours.indexOf(b.hour);
            });
            return results;
        }
        catch (error) {
            this.logger.error(`Error getting daily stats for server ${serverId}: ${error.message}`);
            return [];
        }
    }
    async getPeriodStats(serverId, days) {
        try {
            const hours = ['24', '18', '12', '6'];
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
          DATEDIFF(dpd.date, CURDATE() - INTERVAL ${days - 1} DAY) + 1 AS day,
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
          AND dpd.date >= CURDATE() - INTERVAL ${days - 1} DAY
          AND dpd.date <= CURDATE()
        
        ORDER BY 
          day, 
          FIELD(hour, '24', '18', '12', '6')
      `;
            const results = await this.dailyPlayerDataRepository.query(query);
            return results.filter(item => item.Jugadores !== null && item.Jugadores > -1);
        }
        catch (error) {
            this.logger.error(`Error getting period stats for server ${serverId}: ${error.message}`);
            return [];
        }
    }
};
exports.PlayerStatsService = PlayerStatsService;
exports.PlayerStatsService = PlayerStatsService = PlayerStatsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_player_data_entity_1.DailyPlayerData)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlayerStatsService);
//# sourceMappingURL=player-stats.service.js.map