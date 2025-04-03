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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDataServerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const players_service_1 = require("../services/players.service");
const player_data_server_dto_1 = require("../dto/player-data-server.dto");
let PlayerDataServerController = class PlayerDataServerController {
    constructor(playersService) {
        this.playersService = playersService;
    }
    async getPlayerDataServer(query) {
        return this.playersService.getPlayerDataServer(query);
    }
};
exports.PlayerDataServerController = PlayerDataServerController;
__decorate([
    (0, common_1.Get)('getPlayerDataServer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed player data for a specific server' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Player data retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_data_server_dto_1.PlayerDataServerDto]),
    __metadata("design:returntype", Promise)
], PlayerDataServerController.prototype, "getPlayerDataServer", null);
exports.PlayerDataServerController = PlayerDataServerController = __decorate([
    (0, swagger_1.ApiTags)('players'),
    (0, common_1.Controller)('players'),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], PlayerDataServerController);
//# sourceMappingURL=player-data-server.controller.js.map