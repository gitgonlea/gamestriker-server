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
var UpdateServersJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServersJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const server_entity_1 = require("../modules/servers/entities/server.entity");
const servers_service_1 = require("../modules/servers/services/servers.service");
const websocket_gateway_1 = require("../modules/realtime/gateways/websocket.gateway");
let UpdateServersJob = UpdateServersJob_1 = class UpdateServersJob {
    constructor(configService, serversService, websocketGateway, serverRepository) {
        this.configService = configService;
        this.serversService = serversService;
        this.websocketGateway = websocketGateway;
        this.serverRepository = serverRepository;
        this.logger = new common_1.Logger(UpdateServersJob_1.name);
        this.minDelay = 10 * 1000;
        this.maxDelay = 60 * 1000;
        this.updateInterval = this.configService.get('server.updateInterval') || 15 * 60 * 1000;
    }
    async updateServers() {
        try {
            this.logger.log('Starting server update job');
            const servers = await this.serverRepository.find();
            for (const [index, server] of servers.entries()) {
                const delay = this.getRandomDelay(this.minDelay, this.maxDelay);
                setTimeout(async () => {
                    try {
                        await this.serversService.updateServer(server);
                        this.websocketGateway.notifyServerUpdated(`${server.host}:${server.port}`);
                        this.logger.debug(`Updated server ${server.id} (${server.servername})`);
                    }
                    catch (error) {
                        this.logger.error(`Error updating server ${server.id}: ${error.message}`);
                    }
                }, delay);
            }
        }
        catch (error) {
            this.logger.error(`Error in server update job: ${error.message}`);
        }
    }
    getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
exports.UpdateServersJob = UpdateServersJob;
__decorate([
    (0, schedule_1.Interval)('updateServers', 15 * 60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UpdateServersJob.prototype, "updateServers", null);
exports.UpdateServersJob = UpdateServersJob = UpdateServersJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        servers_service_1.ServersService,
        websocket_gateway_1.WebsocketGateway,
        typeorm_2.Repository])
], UpdateServersJob);
//# sourceMappingURL=update-servers.job.js.map