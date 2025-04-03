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
var ServersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const moment = require("moment-timezone");
const server_repository_1 = require("../repositories/server.repository");
const gameserver_service_1 = require("../../gameserver/services/gameserver.service");
const banner_service_1 = require("./banner.service");
const server_entity_1 = require("../entities/server.entity");
const server_rank_entity_1 = require("../entities/server-rank.entity");
const daily_player_data_entity_1 = require("../../statistics/entities/daily-player-data.entity");
const daily_map_data_entity_1 = require("../../statistics/entities/daily-map-data.entity");
const weekly_map_data_entity_1 = require("../../statistics/entities/weekly-map-data.entity");
const daily_server_variables_entity_1 = require("../entities/daily-server-variables.entity");
const player_data_entity_1 = require("../../players/entities/player-data.entity");
const server_variables_service_1 = require("../../gameserver/services/server-variables.service");
const players_service_1 = require("../../players/services/players.service");
let ServersService = ServersService_1 = class ServersService {
    constructor(serverRepository, gameServerService, serverVariablesService, bannerService, playersService, serverRanksRepository, dailyPlayerDataRepository, dailyMapDataRepository, weeklyMapDataRepository, dailyServerVariablesRepository, playerDataRepository, serverRepo) {
        this.serverRepository = serverRepository;
        this.gameServerService = gameServerService;
        this.serverVariablesService = serverVariablesService;
        this.bannerService = bannerService;
        this.playersService = playersService;
        this.serverRanksRepository = serverRanksRepository;
        this.dailyPlayerDataRepository = dailyPlayerDataRepository;
        this.dailyMapDataRepository = dailyMapDataRepository;
        this.weeklyMapDataRepository = weeklyMapDataRepository;
        this.dailyServerVariablesRepository = dailyServerVariablesRepository;
        this.playerDataRepository = playerDataRepository;
        this.serverRepo = serverRepo;
        this.logger = new common_1.Logger(ServersService_1.name);
    }
    async addServer(addServerDto) {
        try {
            const [ip, portStr] = addServerDto.host.split(':');
            const port = parseInt(portStr, 10);
            const state = await this.gameServerService.queryServer(ip, port);
            if (!state) {
                return 'fail';
            }
            const existingServer = await this.serverRepository.findByHostAndPort(ip, port);
            if (existingServer) {
                return 'duplicated';
            }
            const serverData = {
                host: ip,
                port: port,
                servername: state.name,
                map: state.map,
                maxplayers: state.maxplayers,
                numplayers: state.players
            };
            const server = await this.serverRepository.create(serverData);
            await this.serverRepository.update(server.id, { rank_id: server.id });
            const playerStatsFake = [
                { day: 1, hour: '24', Jugadores: 0 },
                { day: 1, hour: '6', Jugadores: 0 }
            ];
            await this.bannerService.generateBanner(Object.assign(Object.assign({}, serverData), { rank_id: server.id, online: 1 }), playerStatsFake);
            return serverData;
        }
        catch (error) {
            this.logger.error(`Error adding server: ${error.message}`);
            throw error;
        }
    }
    async getServers(query) {
        try {
            if (query.varKey) {
                return await this.getServersWithVariables(query);
            }
            return await this.serverRepository.findAll({
                page: query.page,
                pageSize: query.pageSize,
                name: query.name,
                map: query.map,
                ip: query.ip,
                orderBy: query.orderBy,
                orderDirection: query.orderDirection === 'true',
            });
        }
        catch (error) {
            this.logger.error(`Error fetching servers: ${error.message}`);
            throw error;
        }
    }
    async getServersWithVariables(query) {
        const page = query.page || 1;
        const pageSize = query.pageSize || 5;
        const orderBy = query.orderBy || 'numplayers';
        const orderDirection = query.orderDirection === 'false' ? 'ASC' : 'DESC';
        const qb = this.serverRepo.createQueryBuilder('s')
            .innerJoin('daily_server_variables', 'dsv', 's.id = dsv.server_id');
        if (query.varValue) {
            qb.where(`JSON_EXTRACT(dsv.variables_data, '$.${query.varKey}') = :varValue`, {
                varValue: query.varValue,
            });
        }
        else {
            qb.where(`JSON_CONTAINS_PATH(dsv.variables_data, 'one', :jsonKey)`, {
                jsonKey: `$.${query.varKey}`,
            });
        }
        qb.addOrderBy(`CASE WHEN s.map = 'Desconocido' THEN 1 ELSE 0 END`, 'ASC')
            .addOrderBy(`s.${orderBy}`, orderDirection)
            .skip((page - 1) * pageSize)
            .take(pageSize);
        const [servers, total] = await qb.getManyAndCount();
        return {
            servers,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    async getServerInfo(query) {
        try {
            const portValue = parseInt(query.port, 10);
            if (isNaN(portValue)) {
                this.logger.error(`Invalid port value: ${query.port}`);
                throw new Error(`Invalid port value: ${query.port}`);
            }
            const server = await this.serverRepository.findByHostAndPort(query.host, portValue);
            if (!server) {
                throw new common_1.NotFoundException('Server not found');
            }
            const serverRanks = await this.serverRanksRepository.findOne({
                where: { server_id: server.id }
            });
            const weeklyMapData = await this.weeklyMapDataRepository.findOne({
                where: { server_id: server.id }
            });
            const rankCount = await this.serverRepository.countByRank(server.rank_id);
            const serverCount = await this.serverRepository.count();
            const percentile = Math.round((rankCount / serverCount) * 100);
            const monthlyAvgPlayers = await this.dailyPlayerDataRepository
                .createQueryBuilder()
                .select('((hour_24 + hour_18 + hour_12 + hour_6) / 4)', 'avg')
                .where('server_id = :serverId', { serverId: server.id })
                .getRawOne();
            const response = Object.assign(Object.assign({}, server), { percentile, monthly_avg: monthlyAvgPlayers ? Math.round(monthlyAvgPlayers.avg) : -1 });
            if (serverRanks) {
                response.ServerRanks = [serverRanks];
            }
            else {
                response.ServerRanks = [{ lowest_rank: 0, highest_rank: 0 }];
            }
            if (weeklyMapData && weeklyMapData.map_data) {
                try {
                    response.WeeklyMapData = [
                        { map_data: JSON.parse(weeklyMapData.map_data) }
                    ];
                }
                catch (e) {
                    response.WeeklyMapData = [{ map_data: {} }];
                }
            }
            else {
                response.WeeklyMapData = [{ map_data: {} }];
            }
            return [response];
        }
        catch (error) {
            this.logger.error(`Error fetching server info: ${error.message}`);
            throw error;
        }
    }
    async getServerPlayers(query) {
        try {
            if (query.type === '1') {
                return this.playerDataRepository.find({
                    where: {
                        online: 1,
                        server_id: parseInt(query.id, 10)
                    },
                    order: {
                        current_score: 'DESC'
                    }
                });
            }
            else {
                return this.playerDataRepository.find({
                    where: {
                        server_id: parseInt(query.id, 10),
                        BOT: 0
                    },
                    order: {
                        score: 'DESC'
                    },
                    take: 10
                });
            }
        }
        catch (error) {
            this.logger.error(`Error fetching server players: ${error.message}`);
            throw error;
        }
    }
    async getServerVariables(host, port) {
        try {
            const server = await this.serverRepository.findByHostAndPort(host, parseInt(port, 10));
            if (!server) {
                throw new common_1.NotFoundException('Server not found');
            }
            const variables = await this.dailyServerVariablesRepository.findOne({
                where: { server_id: server.id }
            });
            if (!variables) {
                throw new common_1.NotFoundException('Server variables not found');
            }
            const response = Object.assign(Object.assign({}, variables), { host,
                port, servername: server.servername });
            return [response];
        }
        catch (error) {
            this.logger.error(`Error fetching server variables: ${error.message}`);
            throw error;
        }
    }
    async updateServer(server) {
        try {
            const state = await this.gameServerService.queryServer(server.host, server.port);
            if (state) {
                const nowInBuenosAires = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
                await this.serverRepository.update(server.id, {
                    servername: state.name,
                    map: state.map,
                    maxplayers: state.maxplayers,
                    numplayers: state.players,
                    status: 1,
                    last_update: nowInBuenosAires
                });
                await this.updateDailyMapData(server.id, state.map);
                await this.updateDailyPlayerCount(server.id, state.players);
                await this.playersService.updatePlayTime(server.id);
                const dailyPlayers = await this.getDailyPlayers(server.id);
                await this.bannerService.generateBanner({
                    servername: state.name,
                    map: state.map,
                    maxplayers: state.maxplayers,
                    numplayers: state.players,
                    host: server.host,
                    port: server.port,
                    rank_id: server.rank_id,
                    online: 1
                }, dailyPlayers);
            }
            else {
                await this.setServerOffline(server);
            }
        }
        catch (error) {
            this.logger.error(`Error updating server ${server.id}: ${error.message}`);
            await this.setServerOffline(server);
        }
    }
    async updateDailyMapData(serverId, currentMap) {
        try {
            const rawQuery = `
        SELECT id, map_data 
        FROM daily_map_data 
        WHERE server_id = ? 
        AND date = CURDATE()
      `;
            const [existingData] = await this.dailyMapDataRepository.query(rawQuery, [serverId]);
            if (existingData && existingData.map_data) {
                let mapData;
                try {
                    mapData = JSON.parse(existingData.map_data);
                }
                catch (e) {
                    mapData = {};
                }
                if (!mapData[currentMap]) {
                    mapData[currentMap] = 1;
                }
                else {
                    mapData[currentMap]++;
                }
                await this.dailyMapDataRepository.update({ id: existingData.id }, { map_data: JSON.stringify(mapData) });
            }
            else {
                const initialMapData = { [currentMap]: 1 };
                const initialMapDataJson = JSON.stringify(initialMapData);
                const insertQuery = `
          INSERT INTO daily_map_data (server_id, map_data, date)
          VALUES (?, ?, CURDATE())
        `;
                await this.dailyMapDataRepository.query(insertQuery, [serverId, initialMapDataJson]);
            }
        }
        catch (error) {
            this.logger.error(`Error updating daily map data: ${error.message}`);
        }
    }
    async updateDailyPlayerCount(serverId, players) {
        const currentDate = moment().tz('America/Argentina/Buenos_Aires');
        const currentHour = currentDate.hours();
        if (![24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2].includes(currentHour)) {
            return;
        }
        if (currentDate.minutes() > 10) {
            return;
        }
        try {
            const query = `
        INSERT INTO daily_player_data (server_id, date, hour_${currentHour})
        VALUES (?, CURDATE(), ?)
        ON DUPLICATE KEY UPDATE
        hour_${currentHour} = VALUES(hour_${currentHour})
      `;
            await this.dailyPlayerDataRepository.query(query, [serverId, players]);
        }
        catch (error) {
            this.logger.error(`Error updating daily player count: ${error.message}`);
        }
    }
    async getDailyPlayers(serverId) {
        try {
            const hours = ['24', '22', '20', '18', '16', '14', '12', '10', '8', '6', '4', '2'];
            const query = hours.map(hour => `SELECT 1 AS day, '${hour}' AS hour, hour_${hour} AS Jugadores 
         FROM daily_player_data 
         WHERE date = CURDATE() AND server_id = ?`).join(' UNION ALL ');
            const result = await this.dailyPlayerDataRepository.query(query + " ORDER BY day, FIELD(hour, '24', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22')", Array(hours.length).fill(serverId));
            return result.filter(data => data.Jugadores !== -1);
        }
        catch (error) {
            this.logger.error(`Error getting daily players: ${error.message}`);
            return [];
        }
    }
    async setServerOffline(server) {
        try {
            await this.serverRepository.update(server.id, {
                status: 0,
                map: 'Desconocido',
                numplayers: 0
            });
            const dailyPlayers = await this.getDailyPlayers(server.id);
            await this.bannerService.generateBanner({
                servername: server.servername,
                map: 'Desconocido',
                maxplayers: server.maxplayers,
                numplayers: 0,
                host: server.host,
                port: server.port,
                rank_id: server.rank_id,
                online: 0
            }, dailyPlayers);
        }
        catch (error) {
            this.logger.error(`Error setting server offline: ${error.message}`);
        }
    }
    async saveServerVariables() {
        try {
            const servers = await this.serverRepo.find({
                where: { status: 1 },
                select: ['id', 'host', 'port']
            });
            for (const server of servers) {
                const variables = await this.serverVariablesService.fetchServerVariables(server.host, server.port);
                if (variables) {
                    await this.dailyServerVariablesRepository.upsert({
                        server_id: server.id,
                        variables_data: variables
                    }, { conflictPaths: ['server_id'] });
                }
            }
        }
        catch (error) {
            this.logger.error(`Error saving server variables: ${error.message}`);
        }
    }
};
exports.ServersService = ServersService;
exports.ServersService = ServersService = ServersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, typeorm_1.InjectRepository)(server_rank_entity_1.ServerRank)),
    __param(6, (0, typeorm_1.InjectRepository)(daily_player_data_entity_1.DailyPlayerData)),
    __param(7, (0, typeorm_1.InjectRepository)(daily_map_data_entity_1.DailyMapData)),
    __param(8, (0, typeorm_1.InjectRepository)(weekly_map_data_entity_1.WeeklyMapData)),
    __param(9, (0, typeorm_1.InjectRepository)(daily_server_variables_entity_1.DailyServerVariables)),
    __param(10, (0, typeorm_1.InjectRepository)(player_data_entity_1.PlayerData)),
    __param(11, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [server_repository_1.ServerRepository,
        gameserver_service_1.GameServerService,
        server_variables_service_1.ServerVariablesService,
        banner_service_1.BannerService,
        players_service_1.PlayersService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ServersService);
//# sourceMappingURL=servers.service.js.map