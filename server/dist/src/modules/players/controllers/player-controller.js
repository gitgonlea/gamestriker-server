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
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const players_service_1 = require("../services/players.service");
const player_dto_1 = require("../dto/player.dto");
let PlayerController = class PlayerController {
    constructor(playersService) {
        this.playersService = playersService;
    }
    async getPlayer(query) {
        return this.playersService.getPlayers(query);
    }
};
exports.PlayerController = PlayerController;
__decorate([
    (0, common_1.Get)('getPlayer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get players with pagination and filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Players retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_dto_1.GetPlayerQueryDto]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getPlayer", null);
exports.PlayerController = PlayerController = __decorate([
    (0, swagger_1.ApiTags)('players'),
    (0, common_1.Controller)('players'),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], PlayerController);
//# sourceMappingURL=player-controller.js.map