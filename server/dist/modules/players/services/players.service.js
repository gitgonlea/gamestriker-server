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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var PlayersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_data_entity_1 = require("../entities/player-data.entity");
const daily_player_time_server_data_entity_1 = require("../entities/daily-player-time-server-data.entity");
const daily_player_score_server_data_entity_1 = require("../entities/daily-player-score-server-data.entity");
const server_entity_1 = require("../../servers/entities/server.entity");
let PlayersService = PlayersService_1 = class PlayersService {
    constructor(playerDataRepository, serverRepository, dailyPlayerTimeRepository, dailyPlayerScoreRepository) {
        this.playerDataRepository = playerDataRepository;
        this.serverRepository = serverRepository;
        this.dailyPlayerTimeRepository = dailyPlayerTimeRepository;
        this.dailyPlayerScoreRepository = dailyPlayerScoreRepository;
        this.logger = new common_1.Logger(PlayersService_1.name);
    }
    async getPlayers(query) {
        const { page = 1, pageSize = 10, name, orderBy = 'online', orderDirection, online } = query;
        const offset = (page - 1) * pageSize;
        const isDesc = orderDirection !== 'false';
        const whereConditions = {};
        if (name) {
            whereConditions.player_name = (0, typeorm_2.Like)(`%${name}%`);
        }
        if (online === 'true') {
            whereConditions.online = 1;
        }
        let orderField = 'online';
        if (orderBy === 'name') {
            orderField = 'player_name';
        }
        else if (orderBy === 'time') {
            orderField = 'playtime';
        }
        try {
            const [players, total] = await this.playerDataRepository.findAndCount({
                where: whereConditions,
                relations: ['server'],
                order: { [orderField]: isDesc ? 'DESC' : 'ASC' },
                skip: offset,
                take: pageSize,
            });
            const formattedPlayers = players.map(player => {
                const { server } = player, playerData = __rest(player, ["server"]);
                return Object.assign(Object.assign({}, playerData), { servername: server === null || server === void 0 ? void 0 : server.servername, host: server === null || server === void 0 ? void 0 : server.host, port: server === null || server === void 0 ? void 0 : server.port });
            });
            return {
                players: formattedPlayers,
                totalPages: Math.ceil(total / pageSize),
            };
        }
        catch (error) {
            this.logger.error(`Error fetching players: ${error.message}`);
            throw error;
        }
    }
    async updatePlayTime(serverId) {
    }
    async getPlayerDataServer(query) {
        try {
            const { playerName, host, port, days = '0' } = query;
            const playerData = await this.playerDataRepository.query(`
      SELECT 
          pd.*,
          s.host,
          s.port,
          s.servername,
          s.status,
          dense_rank_with_filter.rank_id AS rank_id,
          total_ranks.total_ranks_count AS rank_total
      FROM 
          player_data pd
      JOIN 
          servers s ON pd.server_id = s.id
      JOIN 
          (SELECT 
               player_name,
               DENSE_RANK() OVER (ORDER BY playtime DESC) AS rank_id
           FROM 
               player_data
           WHERE 
               server_id = (
                   SELECT id
                   FROM servers
                   WHERE host = ? AND port = ?
               )
          ) AS dense_rank_with_filter
      ON 
          pd.player_name = dense_rank_with_filter.player_name
      CROSS JOIN 
          (SELECT COUNT(*) AS total_ranks_count 
           FROM player_data 
           WHERE server_id = (
                   SELECT id
                   FROM servers
                   WHERE host = ? AND port = ?
               )
          ) AS total_ranks
      WHERE 
       s.host = ? AND s.port = ? AND pd.player_name = ?;
    `, [host, port, host, port, host, port, playerName]);
            if (!playerData || playerData.length === 0) {
                return { player_data: [], player_time: [], player_score: [] };
            }
            const serverId = playerData[0].server_id;
            const playerTime = await this.getDailyPlayerData(0, serverId, playerName, days);
            const playerScore = await this.getDailyPlayerData(1, serverId, playerName, days);
            return {
                player_data: playerData,
                player_time: playerTime,
                player_score: playerScore
            };
        }
        catch (error) {
            this.logger.error(`Error fetching player data: ${error.message}`);
            throw error;
        }
    }
    async getDailyPlayerData(type, serverId, playerName, days) {
        try {
            let result = [];
            if (days === '0') {
                const hours = ['24', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
                const repository = type === 0 ? this.dailyPlayerTimeRepository : this.dailyPlayerScoreRepository;
                const queryParams = [];
                const queryParts = [];
                hours.forEach(hour => {
                    queryParts.push(`
          SELECT 
              CASE WHEN date = CURDATE() THEN 1 END AS day,
              '${hour}' AS hour,
              ${type ? 'hour_' + hour : 'ROUND(hour_' + hour + ' / 60)'} AS ${type ? 'Puntaje' : 'Tiempo'}
          FROM 
              ${type ? 'daily_player_score_server_data' : 'daily_player_time_server_data'}
          WHERE 
              date = CURDATE()
              AND server_id = ?
              AND player_name = ?
              AND hour_${hour} != -1
        `);
                    queryParams.push(serverId, playerName);
                });
                result = await repository.query(queryParts.join(' UNION ALL '), queryParams);
            }
            else {
                const repository = type === 0 ? this.dailyPlayerTimeRepository : this.dailyPlayerScoreRepository;
                const hourColumns = Array.from({ length: 24 }, (_, i) => `hour_${i + 1}`);
                const hourColumnsList = hourColumns.map(hour => `CASE WHEN ${hour} != -1 THEN ${hour} ELSE 0 END`).join(' + ');
                const query = `
        SELECT 
            DAY(date) AS day,
            (${hourColumnsList}) AS ${type ? 'Puntaje' : 'Tiempo'}
        FROM 
            ${type ? 'daily_player_score_server_data' : 'daily_player_time_server_data'}
        WHERE 
            server_id = ?
            AND player_name = ?;
      `;
                result = await repository.query(query, [serverId, playerName]);
            }
            return [result];
        }
        catch (error) {
            this.logger.error(`Error retrieving daily player data: ${error.message}`);
            return [[]];
        }
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = PlayersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_data_entity_1.PlayerData)),
    __param(1, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __param(2, (0, typeorm_1.InjectRepository)(daily_player_time_server_data_entity_1.DailyPlayerTimeServerData)),
    __param(3, (0, typeorm_1.InjectRepository)(daily_player_score_server_data_entity_1.DailyPlayerScoreServerData)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PlayersService);
//# sourceMappingURL=players.service.js.map