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
var WeeklyMapDataJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyMapDataJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_map_data_entity_1 = require("../modules/statistics/entities/daily-map-data.entity");
const weekly_map_data_entity_1 = require("../modules/statistics/entities/weekly-map-data.entity");
let WeeklyMapDataJob = WeeklyMapDataJob_1 = class WeeklyMapDataJob {
    constructor(dailyMapDataRepository, weeklyMapDataRepository) {
        this.dailyMapDataRepository = dailyMapDataRepository;
        this.weeklyMapDataRepository = weeklyMapDataRepository;
        this.logger = new common_1.Logger(WeeklyMapDataJob_1.name);
    }
    async aggregateWeeklyMapData() {
        try {
            this.logger.log('Starting weekly map data aggregation job');
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            const dailyMapData = await this.dailyMapDataRepository.find({
                where: {
                    date: (0, typeorm_2.Between)(startDate, endDate)
                }
            });
            const aggregatedResults = this.aggregateResults(dailyMapData);
            for (const result of aggregatedResults) {
                await this.weeklyMapDataRepository.upsert({
                    server_id: result.serverId,
                    map_data: JSON.stringify(result.mapData)
                }, { conflictPaths: ['server_id'] });
            }
            this.logger.log(`Weekly map data updated for ${aggregatedResults.length} servers`);
        }
        catch (error) {
            this.logger.error(`Error aggregating weekly map data: ${error.message}`);
        }
    }
    aggregateResults(results) {
        const mapCountsByServer = new Map();
        for (const result of results) {
            const serverId = result.server_id;
            let mapData;
            try {
                mapData = JSON.parse(result.map_data || '{}');
            }
            catch (error) {
                this.logger.warn(`Invalid map data JSON for server ${serverId}: ${error.message}`);
                continue;
            }
            if (!mapCountsByServer.has(serverId)) {
                mapCountsByServer.set(serverId, new Map());
            }
            const mapCounts = mapCountsByServer.get(serverId);
            for (const [mapName, count] of Object.entries(mapData)) {
                if (mapCounts.has(mapName)) {
                    mapCounts.set(mapName, mapCounts.get(mapName) + count);
                }
                else {
                    mapCounts.set(mapName, count);
                }
            }
        }
        const aggregatedResults = [];
        for (const [serverId, mapCounts] of mapCountsByServer.entries()) {
            const sortedMapCounts = [...mapCounts.entries()]
                .sort((a, b) => b[1] - a[1]);
            const topMaps = sortedMapCounts.slice(0, 5);
            let othersCount = 0;
            let totalCount = 0;
            for (const [_, count] of sortedMapCounts) {
                totalCount += count;
            }
            for (let i = 5; i < sortedMapCounts.length; i++) {
                othersCount += sortedMapCounts[i][1];
            }
            const mapData = topMaps.map(([name, count]) => ({
                name,
                count,
                value: Math.round((count / totalCount) * 100)
            }));
            if (othersCount > 0) {
                mapData.push({
                    name: 'otros',
                    count: othersCount,
                    value: Math.round((othersCount / totalCount) * 100)
                });
            }
            aggregatedResults.push({ serverId, mapData });
        }
        return aggregatedResults;
    }
};
exports.WeeklyMapDataJob = WeeklyMapDataJob;
__decorate([
    (0, schedule_1.Cron)('0 0 * * 0'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WeeklyMapDataJob.prototype, "aggregateWeeklyMapData", null);
exports.WeeklyMapDataJob = WeeklyMapDataJob = WeeklyMapDataJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_map_data_entity_1.DailyMapData)),
    __param(1, (0, typeorm_1.InjectRepository)(weekly_map_data_entity_1.WeeklyMapData)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WeeklyMapDataJob);
//# sourceMappingURL=weekly-map-data.job.js.map