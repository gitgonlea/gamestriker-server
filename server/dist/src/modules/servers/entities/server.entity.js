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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const typeorm_1 = require("typeorm");
const player_data_entity_1 = require("../../players/entities/player-data.entity");
const server_rank_entity_1 = require("./server-rank.entity");
const weekly_map_data_entity_1 = require("../../statistics/entities/weekly-map-data.entity");
const daily_map_data_entity_1 = require("../../statistics/entities/daily-map-data.entity");
const daily_player_data_entity_1 = require("../../statistics/entities/daily-player-data.entity");
const daily_ranks_data_entity_1 = require("../../statistics/entities/daily-ranks-data.entity");
const daily_server_variables_entity_1 = require("./daily-server-variables.entity");
let Server = class Server {
};
exports.Server = Server;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Server.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64, nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Server.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 65, nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "servername", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "map", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Server.prototype, "maxplayers", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Server.prototype, "numplayers", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Server.prototype, "rank_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Server.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Server.prototype, "last_update", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => player_data_entity_1.PlayerData, playerData => playerData.server),
    __metadata("design:type", Array)
], Server.prototype, "playerData", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => server_rank_entity_1.ServerRank, serverRank => serverRank.server),
    __metadata("design:type", Array)
], Server.prototype, "serverRanks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => weekly_map_data_entity_1.WeeklyMapData, weeklyMapData => weeklyMapData.server),
    __metadata("design:type", Array)
], Server.prototype, "weeklyMapData", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => daily_map_data_entity_1.DailyMapData, dailyMapData => dailyMapData.server),
    __metadata("design:type", Array)
], Server.prototype, "dailyMapData", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => daily_player_data_entity_1.DailyPlayerData, dailyPlayerData => dailyPlayerData.server),
    __metadata("design:type", Array)
], Server.prototype, "dailyPlayerData", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => daily_ranks_data_entity_1.DailyRanksData, dailyRanksData => dailyRanksData.server),
    __metadata("design:type", Array)
], Server.prototype, "dailyRanksData", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => daily_server_variables_entity_1.DailyServerVariables, dailyServerVariables => dailyServerVariables.server),
    __metadata("design:type", Array)
], Server.prototype, "dailyServerVariables", void 0);
exports.Server = Server = __decorate([
    (0, typeorm_1.Entity)({ name: 'servers' })
], Server);
//# sourceMappingURL=server.entity.js.map