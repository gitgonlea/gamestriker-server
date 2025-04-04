import { Repository } from 'typeorm';
import { ServerRepository } from '../repositories/server.repository';
import { GameServerService } from '../../gameserver/services/gameserver.service';
import { BannerService } from './banner.service';
import { Server } from '../entities/server.entity';
import { ServerRank } from '../entities/server-rank.entity';
import { DailyPlayerData } from '../../statistics/entities/daily-player-data.entity';
import { DailyMapData } from '../../statistics/entities/daily-map-data.entity';
import { WeeklyMapData } from '../../statistics/entities/weekly-map-data.entity';
import { DailyServerVariables } from '../entities/daily-server-variables.entity';
import { PlayerData } from '../../players/entities/player-data.entity';
import { AddServerDto, GetServersQueryDto, ServerInfoDto, ServerPlayersQueryDto } from '../dto/server.dto';
import { ServerVariablesService } from '../../gameserver/services/server-variables.service';
import { PlayersService } from '../../players/services/players.service';
export declare class ServersService {
    private readonly serverRepository;
    private readonly gameServerService;
    private readonly serverVariablesService;
    private readonly bannerService;
    private readonly playersService;
    private serverRanksRepository;
    private dailyPlayerDataRepository;
    private dailyMapDataRepository;
    private weeklyMapDataRepository;
    private dailyServerVariablesRepository;
    private playerDataRepository;
    private readonly serverRepo;
    private readonly logger;
    constructor(serverRepository: ServerRepository, gameServerService: GameServerService, serverVariablesService: ServerVariablesService, bannerService: BannerService, playersService: PlayersService, serverRanksRepository: Repository<ServerRank>, dailyPlayerDataRepository: Repository<DailyPlayerData>, dailyMapDataRepository: Repository<DailyMapData>, weeklyMapDataRepository: Repository<WeeklyMapData>, dailyServerVariablesRepository: Repository<DailyServerVariables>, playerDataRepository: Repository<PlayerData>, serverRepo: Repository<Server>);
    addServer(addServerDto: AddServerDto): Promise<any>;
    getServers(query: GetServersQueryDto): Promise<{
        servers: Server[];
        totalPages: number;
    }>;
    private getServersWithVariables;
    getServerInfo(query: ServerInfoDto): Promise<Server[]>;
    getServerPlayers(query: ServerPlayersQueryDto): Promise<PlayerData[]>;
    getServerVariables(host: string, port: string): Promise<any[]>;
    updateServer(server: Server): Promise<void>;
    private updateDailyMapData;
    private updateDailyPlayerCount;
    private getDailyPlayers;
    private setServerOffline;
    saveServerVariables(): Promise<void>;
}
