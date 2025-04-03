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
var SaveServerVariablesJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveServerVariablesJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const server_entity_1 = require("../modules/servers/entities/server.entity");
const daily_server_variables_entity_1 = require("../modules/servers/entities/daily-server-variables.entity");
const server_variables_service_1 = require("../modules/gameserver/services/server-variables.service");
let SaveServerVariablesJob = SaveServerVariablesJob_1 = class SaveServerVariablesJob {
    constructor(serverRepository, dailyServerVariablesRepository, serverVariablesService) {
        this.serverRepository = serverRepository;
        this.dailyServerVariablesRepository = dailyServerVariablesRepository;
        this.serverVariablesService = serverVariablesService;
        this.logger = new common_1.Logger(SaveServerVariablesJob_1.name);
    }
    async saveServerVariables() {
        try {
            this.logger.log('Starting server variables collection job');
            const servers = await this.serverRepository.find({
                where: { status: 1 },
                select: ['id', 'host', 'port']
            });
            let successCount = 0;
            for (const server of servers) {
                try {
                    const variables = await this.serverVariablesService.fetchServerVariables(server.host, server.port);
                    if (variables) {
                        await this.dailyServerVariablesRepository.upsert({
                            server_id: server.id,
                            variables_data: variables
                        }, { conflictPaths: ['server_id'] });
                        successCount++;
                    }
                }
                catch (error) {
                    this.logger.error(`Error saving variables for server ${server.id}: ${error.message}`);
                }
            }
            this.logger.log(`Server variables updated for ${successCount} out of ${servers.length} servers`);
        }
        catch (error) {
            this.logger.error(`Error in server variables job: ${error.message}`);
        }
    }
};
exports.SaveServerVariablesJob = SaveServerVariablesJob;
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SaveServerVariablesJob.prototype, "saveServerVariables", null);
exports.SaveServerVariablesJob = SaveServerVariablesJob = SaveServerVariablesJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __param(1, (0, typeorm_1.InjectRepository)(daily_server_variables_entity_1.DailyServerVariables)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        server_variables_service_1.ServerVariablesService])
], SaveServerVariablesJob);
//# sourceMappingURL=save-server-variables.job.js.map