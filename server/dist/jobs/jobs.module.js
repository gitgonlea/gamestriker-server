"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const update_servers_job_1 = require("./update-servers.job");
const update_ranks_job_1 = require("./update-ranks.job");
const weekly_map_data_job_1 = require("./weekly-map-data.job");
const save_server_variables_job_1 = require("./save-server-variables.job");
const servers_module_1 = require("../modules/servers/servers.module");
const players_module_1 = require("../modules/players/players.module");
const statistics_module_1 = require("../modules/statistics/statistics.module");
const realtime_module_1 = require("../modules/realtime/realtime.module");
const server_entity_1 = require("../modules/servers/entities/server.entity");
const player_data_entity_1 = require("../modules/players/entities/player-data.entity");
const daily_ranks_data_entity_1 = require("../modules/statistics/entities/daily-ranks-data.entity");
const server_rank_entity_1 = require("../modules/servers/entities/server-rank.entity");
const daily_map_data_entity_1 = require("../modules/statistics/entities/daily-map-data.entity");
const weekly_map_data_entity_1 = require("../modules/statistics/entities/weekly-map-data.entity");
const daily_server_variables_entity_1 = require("../modules/servers/entities/daily-server-variables.entity");
const gameserver_module_1 = require("../modules/gameserver/gameserver.module");
let JobsModule = class JobsModule {
};
exports.JobsModule = JobsModule;
exports.JobsModule = JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                server_entity_1.Server,
                player_data_entity_1.PlayerData,
                daily_ranks_data_entity_1.DailyRanksData,
                server_rank_entity_1.ServerRank,
                daily_map_data_entity_1.DailyMapData,
                weekly_map_data_entity_1.WeeklyMapData,
                daily_server_variables_entity_1.DailyServerVariables
            ]),
            servers_module_1.ServersModule,
            players_module_1.PlayersModule,
            statistics_module_1.StatisticsModule,
            realtime_module_1.RealtimeModule,
            gameserver_module_1.GameServerModule
        ],
        providers: [
            update_servers_job_1.UpdateServersJob,
            update_ranks_job_1.UpdateRanksJob,
            weekly_map_data_job_1.WeeklyMapDataJob,
            save_server_variables_job_1.SaveServerVariablesJob
        ],
    })
], JobsModule);
//# sourceMappingURL=jobs.module.js.map