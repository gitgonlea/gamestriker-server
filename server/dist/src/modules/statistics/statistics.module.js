"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const player_stats_controller_1 = require("./controllers/player-stats.controller");
const rank_stats_controller_1 = require("./controllers/rank-stats.controller");
const player_stats_service_1 = require("./services/player-stats.service");
const rank_stats_service_1 = require("./services/rank-stats.service");
const daily_map_data_entity_1 = require("./entities/daily-map-data.entity");
const daily_player_data_entity_1 = require("./entities/daily-player-data.entity");
const daily_ranks_data_entity_1 = require("./entities/daily-ranks-data.entity");
const weekly_map_data_entity_1 = require("./entities/weekly-map-data.entity");
let StatisticsModule = class StatisticsModule {
};
exports.StatisticsModule = StatisticsModule;
exports.StatisticsModule = StatisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                daily_map_data_entity_1.DailyMapData,
                daily_player_data_entity_1.DailyPlayerData,
                daily_ranks_data_entity_1.DailyRanksData,
                weekly_map_data_entity_1.WeeklyMapData,
            ]),
        ],
        controllers: [player_stats_controller_1.PlayerStatsController, rank_stats_controller_1.RankStatsController],
        providers: [player_stats_service_1.PlayerStatsService, rank_stats_service_1.RankStatsService],
        exports: [player_stats_service_1.PlayerStatsService, rank_stats_service_1.RankStatsService],
    })
], StatisticsModule);
//# sourceMappingURL=statistics.module.js.map