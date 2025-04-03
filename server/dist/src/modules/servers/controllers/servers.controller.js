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
exports.ServersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const servers_service_1 = require("../services/servers.service");
const server_dto_1 = require("../dto/server.dto");
let ServersController = class ServersController {
    constructor(serversService) {
        this.serversService = serversService;
    }
    async addServer(addServerDto) {
        try {
            const result = await this.serversService.addServer(addServerDto);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getServers(query) {
        try {
            return await this.serversService.getServers(query);
        }
        catch (error) {
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getServerInfo(query) {
        try {
            return await this.serversService.getServerInfo(query);
        }
        catch (error) {
            if (error.message === 'Server not found') {
                throw new common_1.HttpException('Server not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getServerPlayers(query) {
        try {
            return await this.serversService.getServerPlayers(query);
        }
        catch (error) {
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getServerVariables(host, port) {
        try {
            return await this.serversService.getServerVariables(host, port);
        }
        catch (error) {
            if (error.message === 'Server not found' || error.message === 'Server variables not found') {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ServersController = ServersController;
__decorate([
    (0, common_1.Post)('addServer'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new server' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Server added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [server_dto_1.AddServerDto]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "addServer", null);
__decorate([
    (0, common_1.Get)('getServers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get servers with pagination and filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Servers retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [server_dto_1.GetServersQueryDto]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "getServers", null);
__decorate([
    (0, common_1.Get)('getServerInfo'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed information about a server' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Server info retrieved successfully', type: [server_dto_1.ServerResponse] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Server not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [server_dto_1.ServerInfoDto]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "getServerInfo", null);
__decorate([
    (0, common_1.Get)('getServerPlayers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get players for a specific server' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Server players retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [server_dto_1.ServerPlayersQueryDto]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "getServerPlayers", null);
__decorate([
    (0, common_1.Get)('getServerVariables'),
    (0, swagger_1.ApiOperation)({ summary: 'Get variables for a specific server' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Server variables retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Server or variables not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('host')),
    __param(1, (0, common_1.Query)('port')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ServersController.prototype, "getServerVariables", null);
exports.ServersController = ServersController = __decorate([
    (0, swagger_1.ApiTags)('servers'),
    (0, common_1.Controller)('servers'),
    __metadata("design:paramtypes", [servers_service_1.ServersService])
], ServersController);
//# sourceMappingURL=servers.controller.js.map