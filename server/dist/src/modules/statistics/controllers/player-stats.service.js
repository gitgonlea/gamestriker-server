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
            results.sort((a, b) => {
                return hours.indexOf(a.hour) - hours.indexOf(b.hour);
            });
            return results;
        }
        catch (error) {
            this.logger.error(`Error getting daily stats: ${error.message}`);
            return [];
        }
    }
    async getPeriodStats(serverId, days) {
        try {
            const hours = ['24', '18', '12', '6'];
            const repeatedParts = [];
            let repeatedPart = '';
            for (let i = 0; i < days; i++) {
                if (i === days - 1) {
                    repeatedPart += `WHEN date = CURDATE() THEN '${i + 1}'`;
                }
                else {
                    repeatedPart += `WHEN date = CURDATE() - INTERVAL ${days - i - 1} DAY THEN '${i + 1}'`;
                }
            }
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
            const query = repeatedParts.join(' UNION ALL ') +
                " ORDER BY day, FIELD(hour, '24', '22', '20', '18', '16', '14', '12', '10', '8', '6', '4', '2');";
            const result = await this.dailyPlayerDataRepository.query(query);
            return result;
        }
        catch (error) {
            this.logger.error(`Error getting period stats: ${error.message}`);
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