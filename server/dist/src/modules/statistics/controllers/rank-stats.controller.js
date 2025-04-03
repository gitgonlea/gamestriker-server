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
exports.RankStatsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rank_stats_service_1 = require("../services/rank-stats.service");
const rank_stats_dto_1 = require("../dto/rank-stats.dto");
let RankStatsController = class RankStatsController {
    constructor(rankStatsService) {
        this.rankStatsService = rankStatsService;
    }
    async getRankStats(query) {
        return this.rankStatsService.getRankStats(query);
    }
};
exports.RankStatsController = RankStatsController;
__decorate([
    (0, common_1.Get)('getRankStats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rank statistics for a server' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rank statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rank_stats_dto_1.RankStatsQueryDto]),
    __metadata("design:returntype", Promise)
], RankStatsController.prototype, "getRankStats", null);
exports.RankStatsController = RankStatsController = __decorate([
    (0, swagger_1.ApiTags)('statistics'),
    (0, common_1.Controller)('statistics'),
    __metadata("design:paramtypes", [rank_stats_service_1.RankStatsService])
], RankStatsController);
//# sourceMappingURL=rank-stats.controller.js.map