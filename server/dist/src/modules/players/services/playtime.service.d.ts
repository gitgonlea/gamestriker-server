import { Repository } from 'typeorm';
import { PlayerData } from '../entities/player-data.entity';
import { DailyPlayerTimeServerData } from '../entities/daily-player-time-server-data.entity';
import { DailyPlayerScoreServerData } from '../entities/daily-player-score-server-data.entity';
import { GameServerService } from '../../gameserver/services/gameserver.service';
import { Server } from '../../servers/entities/server.entity';
export declare class PlaytimeService {
    private readonly playerDataRepository;
    private readonly dailyPlayerTimeRepository;
    private readonly dailyPlayerScoreRepository;
    private readonly serverRepository;
    private readonly gameServerService;
    private readonly logger;
    constructor(playerDataRepository: Repository<PlayerData>, dailyPlayerTimeRepository: Repository<DailyPlayerTimeServerData>, dailyPlayerScoreRepository: Repository<DailyPlayerScoreServerData>, serverRepository: Repository<Server>, gameServerService: GameServerService);
    updatePlayTime(serverId: number): Promise<void>;
    private processPlayerData;
    private updateDailyPlayerData;
}
