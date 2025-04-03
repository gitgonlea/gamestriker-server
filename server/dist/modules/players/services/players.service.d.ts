import { Repository } from 'typeorm';
import { PlayerData } from '../entities/player-data.entity';
import { DailyPlayerTimeServerData } from '../entities/daily-player-time-server-data.entity';
import { DailyPlayerScoreServerData } from '../entities/daily-player-score-server-data.entity';
import { GetPlayerQueryDto } from '../dto/player.dto';
import { PlayerDataServerDto } from '../dto/player-data-server.dto';
import { Server } from '../../servers/entities/server.entity';
export declare class PlayersService {
    private readonly playerDataRepository;
    private readonly serverRepository;
    private readonly dailyPlayerTimeRepository;
    private readonly dailyPlayerScoreRepository;
    private readonly logger;
    constructor(playerDataRepository: Repository<PlayerData>, serverRepository: Repository<Server>, dailyPlayerTimeRepository: Repository<DailyPlayerTimeServerData>, dailyPlayerScoreRepository: Repository<DailyPlayerScoreServerData>);
    getPlayers(query: GetPlayerQueryDto): Promise<{
        players: any[];
        totalPages: number;
    }>;
    updatePlayTime(serverId: number): Promise<void>;
    getPlayerDataServer(query: PlayerDataServerDto): Promise<any>;
    private getDailyPlayerData;
}
