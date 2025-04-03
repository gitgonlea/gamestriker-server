"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const servers_controller_1 = require("./controllers/servers.controller");
const servers_service_1 = require("./services/servers.service");
const banner_service_1 = require("./services/banner.service");
const server_repository_1 = require("./repositories/server.repository");
const server_entity_1 = require("./entities/server.entity");
const server_rank_entity_1 = require("./entities/server-rank.entity");
const daily_server_variables_entity_1 = require("./entities/daily-server-variables.entity");
const daily_map_data_entity_1 = require("../statistics//entities/daily-map-data.entity");
const daily_player_data_entity_1 = require("../statistics/entities/daily-player-data.entity");
const weekly_map_data_entity_1 = require("../statistics/entities/weekly-map-data.entity");
const player_data_entity_1 = require("../players/entities/player-data.entity");
const gameserver_module_1 = require("../gameserver/gameserver.module");
const players_module_1 = require("../players/players.module");
let ServersModule = class ServersModule {
};
exports.ServersModule = ServersModule;
exports.ServersModule = ServersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                server_entity_1.Server,
                server_rank_entity_1.ServerRank,
                daily_server_variables_entity_1.DailyServerVariables,
                daily_map_data_entity_1.DailyMapData,
                daily_player_data_entity_1.DailyPlayerData,
                weekly_map_data_entity_1.WeeklyMapData,
                player_data_entity_1.PlayerData,
            ]),
            gameserver_module_1.GameServerModule,
            players_module_1.PlayersModule,
        ],
        controllers: [servers_controller_1.ServersController],
        providers: [servers_service_1.ServersService, banner_service_1.BannerService, server_repository_1.ServerRepository],
        exports: [servers_service_1.ServersService, banner_service_1.BannerService, server_repository_1.ServerRepository],
    })
], ServersModule);
//# sourceMappingURL=servers.module.js.map