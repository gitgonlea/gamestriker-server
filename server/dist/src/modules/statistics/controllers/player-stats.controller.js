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
exports.PlayerStatsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const player_stats_service_1 = require("../services/player-stats.service");
const player_stats_dto_1 = require("../dto/player-stats.dto");
let PlayerStatsController = class PlayerStatsController {
    constructor(playerStatsService) {
        this.playerStatsService = playerStatsService;
    }
    async getPlayerStats(query) {
        return this.playerStatsService.getPlayerStats(query);
    }
};
exports.PlayerStatsController = PlayerStatsController;
__decorate([
    (0, common_1.Get)('getPlayerStats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get player statistics for a server' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Player statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_stats_dto_1.PlayerStatsQueryDto]),
    __metadata("design:returntype", Promise)
], PlayerStatsController.prototype, "getPlayerStats", null);
exports.PlayerStatsController = PlayerStatsController = __decorate([
    (0, swagger_1.ApiTags)('statistics'),
    (0, common_1.Controller)('statistics'),
    __metadata("design:paramtypes", [player_stats_service_1.PlayerStatsService])
], PlayerStatsController);
//# sourceMappingURL=player-stats.controller.js.map