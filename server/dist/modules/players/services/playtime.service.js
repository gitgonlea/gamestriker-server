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
var PlaytimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaytimeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const moment = require("moment-timezone");
const player_data_entity_1 = require("../entities/player-data.entity");
const daily_player_time_server_data_entity_1 = require("../entities/daily-player-time-server-data.entity");
const daily_player_score_server_data_entity_1 = require("../entities/daily-player-score-server-data.entity");
const gameserver_service_1 = require("../../gameserver/services/gameserver.service");
const server_entity_1 = require("../../servers/entities/server.entity");
let PlaytimeService = PlaytimeService_1 = class PlaytimeService {
    constructor(playerDataRepository, dailyPlayerTimeRepository, dailyPlayerScoreRepository, serverRepository, gameServerService) {
        this.playerDataRepository = playerDataRepository;
        this.dailyPlayerTimeRepository = dailyPlayerTimeRepository;
        this.dailyPlayerScoreRepository = dailyPlayerScoreRepository;
        this.serverRepository = serverRepository;
        this.gameServerService = gameServerService;
        this.logger = new common_1.Logger(PlaytimeService_1.name);
    }
    async updatePlayTime(serverId) {
        try {
            const server = await this.serverRepository.findOne({ where: { id: serverId } });
            if (!server) {
                throw new Error(`Server with id ${serverId} not found`);
            }
            await this.playerDataRepository.update({ server_id: serverId }, { online: 0 });
            const playerData = await this.gameServerService.queryServerPlayers(server.host, server.port);
            if (!playerData || playerData.length === 0) {
                return;
            }
            const playerNames = playerData.map(player => player.name);
            const existingPlayers = await this.playerDataRepository.find({
                where: {
                    server_id: serverId,
                    player_name: (0, typeorm_2.In)(playerNames),
                },
            });
            const existingPlayerMap = existingPlayers.reduce((map, player) => {
                map[player.player_name] = player;
                return map;
            }, {});
            for (const player of playerData) {
                await this.processPlayerData(serverId, player, existingPlayerMap);
            }
        }
        catch (error) {
            this.logger.error(`Error updating play time for server ${serverId}: ${error.message}`);
        }
    }
    async processPlayerData(serverId, playerInfo, existingPlayerMap) {
        try {
            const playerName = playerInfo.name;
            const currentPlaytime = playerInfo.online;
            const currentScore = playerInfo.score;
            const existingPlayer = existingPlayerMap[playerName] || {
                playtime: 0,
                score: 0,
                previous_playtime: 0,
                previous_score: 0,
                last_seen: null
            };
            const currentTime = new Date();
            const lastSeenTime = existingPlayer.last_seen ? new Date(existingPlayer.last_seen) : null;
            let playtimeDifference = 0;
            let scoreDifference = 0;
            if (lastSeenTime && (currentTime.getTime() - lastSeenTime.getTime()) / (1000 * 60) < 16) {
                if (currentPlaytime >= existingPlayer.previous_playtime) {
                    playtimeDifference = currentPlaytime - existingPlayer.previous_playtime;
                }
            }
            else {
                playtimeDifference = currentPlaytime;
            }
            if (currentScore >= existingPlayer.previous_score) {
                scoreDifference = currentScore - existingPlayer.previous_score;
            }
            else {
                scoreDifference = currentScore;
            }
            const newPlaytime = existingPlayer.playtime + playtimeDifference;
            const newScore = existingPlayer.score + scoreDifference;
            await this.playerDataRepository.upsert({
                server_id: serverId,
                player_name: playerName,
                playtime: newPlaytime,
                score: newScore,
                online: 1,
                last_seen: new Date(),
                current_playtime: currentPlaytime,
                current_score: currentScore,
                previous_playtime: currentPlaytime,
                previous_score: currentScore,
                BOT: playerName.includes('BOT') ? 1 : 0
            }, {
                conflictPaths: ['server_id', 'player_name']
            });
            await this.updateDailyPlayerData(serverId, 0, newPlaytime, playerName);
            await this.updateDailyPlayerData(serverId, 1, newScore, playerName);
        }
        catch (error) {
            this.logger.error(`Error processing player data: ${error.message}`);
        }
    }
    async updateDailyPlayerData(serverId, type, value, playerName) {
        try {
            const currentDate = moment().tz('America/Argentina/Buenos_Aires');
            const currentHour = currentDate.hours();
            if (![24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].includes(currentHour)) {
                return;
            }
            const repository = type === 0 ? this.dailyPlayerTimeRepository : this.dailyPlayerScoreRepository;
            const tableName = type === 0 ? 'daily_player_time_server_data' : 'daily_player_score_server_data';
            const query = `
        INSERT INTO ${tableName} 
          (server_id, player_name, date, hour_${currentHour})
        VALUES 
          (?, ?, CURDATE(), ?)
        ON DUPLICATE KEY UPDATE 
          hour_${currentHour} = VALUES(hour_${currentHour})
      `;
            await repository.query(query, [serverId, playerName, value]);
        }
        catch (error) {
            this.logger.error(`Error updating daily player ${type ? 'score' : 'time'} data: ${error.message}`);
        }
    }
};
exports.PlaytimeService = PlaytimeService;
exports.PlaytimeService = PlaytimeService = PlaytimeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_data_entity_1.PlayerData)),
    __param(1, (0, typeorm_1.InjectRepository)(daily_player_time_server_data_entity_1.DailyPlayerTimeServerData)),
    __param(2, (0, typeorm_1.InjectRepository)(daily_player_score_server_data_entity_1.DailyPlayerScoreServerData)),
    __param(3, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        gameserver_service_1.GameServerService])
], PlaytimeService);
//# sourceMappingURL=playtime.service.js.map