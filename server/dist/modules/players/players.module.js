"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const player_controller_1 = require("./controllers/player-controller");
const player_data_server_controller_1 = require("./controllers/player-data-server.controller");
const players_service_1 = require("./services/players.service");
const playtime_service_1 = require("./services/playtime.service");
const player_data_entity_1 = require("./entities/player-data.entity");
const daily_player_time_server_data_entity_1 = require("./entities/daily-player-time-server-data.entity");
const daily_player_score_server_data_entity_1 = require("./entities/daily-player-score-server-data.entity");
const gameserver_module_1 = require("../gameserver/gameserver.module");
const server_entity_1 = require("../servers/entities/server.entity");
let PlayersModule = class PlayersModule {
};
exports.PlayersModule = PlayersModule;
exports.PlayersModule = PlayersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                player_data_entity_1.PlayerData,
                daily_player_time_server_data_entity_1.DailyPlayerTimeServerData,
                daily_player_score_server_data_entity_1.DailyPlayerScoreServerData,
                server_entity_1.Server,
            ]),
            gameserver_module_1.GameServerModule,
        ],
        controllers: [player_controller_1.PlayerController, player_data_server_controller_1.PlayerDataServerController],
        providers: [players_service_1.PlayersService, playtime_service_1.PlaytimeService],
        exports: [players_service_1.PlayersService, playtime_service_1.PlaytimeService],
    })
], PlayersModule);
//# sourceMappingURL=players.module.js.map