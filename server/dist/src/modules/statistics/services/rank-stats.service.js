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
var RankStatsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankStatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_ranks_data_entity_1 = require("../entities/daily-ranks-data.entity");
let RankStatsService = RankStatsService_1 = class RankStatsService {
    constructor(dailyRanksDataRepository) {
        this.dailyRanksDataRepository = dailyRanksDataRepository;
        this.logger = new common_1.Logger(RankStatsService_1.name);
    }
    async getRankStats(query) {
        try {
            const rawQuery = `
        SELECT 
          date, rank_id as "Rank"
        FROM 
          daily_ranks_data
        WHERE 
          server_id = ?
          AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ORDER BY 
          date ASC
      `;
            const rankStats = await this.dailyRanksDataRepository.query(rawQuery, [query.server_id]);
            return rankStats;
        }
        catch (error) {
            this.logger.error(`Error retrieving rank stats: ${error.message}`);
            throw error;
        }
    }
};
exports.RankStatsService = RankStatsService;
exports.RankStatsService = RankStatsService = RankStatsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_ranks_data_entity_1.DailyRanksData)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RankStatsService);
//# sourceMappingURL=rank-stats.service.js.map