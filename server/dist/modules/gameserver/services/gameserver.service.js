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
var GameServerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const SourceQuery = require("sourcequery");
let GameServerService = GameServerService_1 = class GameServerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GameServerService_1.name);
        this.timeout = this.configService.get('server.queryTimeout') || 1000;
    }
    async queryServer(host, port) {
        const sq = new SourceQuery(this.timeout);
        try {
            sq.open(host, port);
            const info = await new Promise((resolve, reject) => {
                sq.getInfo((err, info) => {
                    if (err)
                        return reject(err);
                    resolve(info);
                });
            });
            return {
                name: info.name,
                map: info.map,
                maxplayers: info.maxplayers,
                players: info.players,
                bots: info.bots || 0,
                password: !!info.password,
                version: info.version,
                ping: 0,
                connect: `${host}:${port}`,
                raw: info
            };
        }
        catch (error) {
            this.logger.error(`Error querying server ${host}:${port}: ${error.message || error}`);
            return null;
        }
        finally {
            sq.close();
        }
    }
    async queryServerPlayers(host, port) {
        const sq = new SourceQuery(this.timeout);
        try {
            sq.open(host, port);
            const players = await new Promise((resolve, reject) => {
                sq.getPlayers((err, players) => {
                    if (err)
                        return reject(err);
                    resolve(players || []);
                });
            });
            return players.map(player => ({
                name: player.name,
                score: player.score || 0,
                online: player.time || 0,
                raw: player
            }));
        }
        catch (error) {
            this.logger.error(`Error querying players from server ${host}:${port}: ${error.message || error}`);
            return [];
        }
        finally {
            sq.close();
        }
    }
};
exports.GameServerService = GameServerService;
exports.GameServerService = GameServerService = GameServerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GameServerService);
//# sourceMappingURL=gameserver.service.js.map