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
var UpdateRanksJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRanksJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const moment = require("moment-timezone");
const server_entity_1 = require("../modules/servers/entities/server.entity");
const player_data_entity_1 = require("../modules/players/entities/player-data.entity");
const daily_ranks_data_entity_1 = require("../modules/statistics/entities/daily-ranks-data.entity");
const server_rank_entity_1 = require("../modules/servers/entities/server-rank.entity");
let UpdateRanksJob = UpdateRanksJob_1 = class UpdateRanksJob {
    constructor(serverRepository, playerDataRepository, dailyRanksDataRepository, serverRanksRepository) {
        this.serverRepository = serverRepository;
        this.playerDataRepository = playerDataRepository;
        this.dailyRanksDataRepository = dailyRanksDataRepository;
        this.serverRanksRepository = serverRanksRepository;
        this.logger = new common_1.Logger(UpdateRanksJob_1.name);
    }
    async updateRanks() {
        try {
            this.logger.log('Starting server ranks update job');
            const servers = await this.playerDataRepository
                .createQueryBuilder('player')
                .select('player.server_id')
                .addSelect('SUM(player.playtime)', 'total_playtime')
                .where('player.BOT = 0')
                .groupBy('player.server_id')
                .orderBy('total_playtime', 'DESC')
                .getRawMany();
            for (let i = 0; i < servers.length; i++) {
                const server = servers[i];
                const rank = i + 1;
                await this.updateServerRank(server.server_id, rank);
            }
            this.logger.log(`Server ranks updated for ${servers.length} servers`);
        }
        catch (error) {
            this.logger.error(`Error updating server ranks: ${error.message}`);
        }
    }
    async updateServerRank(serverId, rank) {
        try {
            await this.serverRepository.update(serverId, { rank_id: rank });
            await this.dailyRanksDataRepository.upsert({
                server_id: serverId,
                rank_id: rank,
                date: new Date()
            }, { conflictPaths: ['server_id', 'date'] });
            await this.updateHighLowRanks(serverId, rank);
        }
        catch (error) {
            this.logger.error(`Error updating rank for server ${serverId}: ${error.message}`);
        }
    }
    async updateHighLowRanks(serverId, rank) {
        try {
            const currentDate = moment().tz('America/Argentina/Buenos_Aires');
            const currentMonth = currentDate.month() + 1;
            const currentYear = currentDate.year();
            let serverRank = await this.serverRanksRepository.findOne({
                where: {
                    server_id: serverId,
                    month: currentMonth,
                    year: currentYear
                }
            });
            if (!serverRank) {
                serverRank = this.serverRanksRepository.create({
                    server_id: serverId,
                    month: currentMonth,
                    year: currentYear,
                    lowest_rank: rank,
                    highest_rank: rank
                });
                await this.serverRanksRepository.save(serverRank);
            }
            else {
                let { highest_rank, lowest_rank } = serverRank;
                if (rank < lowest_rank) {
                    lowest_rank = rank;
                }
                if (rank > highest_rank) {
                    highest_rank = rank;
                }
                await this.serverRanksRepository.update({ id: serverRank.id }, { lowest_rank, highest_rank });
            }
        }
        catch (error) {
            this.logger.error(`Error updating high/low ranks for server ${serverId}: ${error.message}`);
        }
    }
};
exports.UpdateRanksJob = UpdateRanksJob;
__decorate([
    (0, schedule_1.Cron)('0 6,18 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UpdateRanksJob.prototype, "updateRanks", null);
exports.UpdateRanksJob = UpdateRanksJob = UpdateRanksJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __param(1, (0, typeorm_1.InjectRepository)(player_data_entity_1.PlayerData)),
    __param(2, (0, typeorm_1.InjectRepository)(daily_ranks_data_entity_1.DailyRanksData)),
    __param(3, (0, typeorm_1.InjectRepository)(server_rank_entity_1.ServerRank)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UpdateRanksJob);
//# sourceMappingURL=update-ranks.job.js.map