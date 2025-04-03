import { Repository } from 'typeorm';
import { Server } from '../modules/servers/entities/server.entity';
import { PlayerData } from '../modules/players/entities/player-data.entity';
import { DailyRanksData } from '../modules/statistics/entities/daily-ranks-data.entity';
import { ServerRank } from '../modules/servers/entities/server-rank.entity';
export declare class UpdateRanksJob {
    private readonly serverRepository;
    private readonly playerDataRepository;
    private readonly dailyRanksDataRepository;
    private readonly serverRanksRepository;
    private readonly logger;
    constructor(serverRepository: Repository<Server>, playerDataRepository: Repository<PlayerData>, dailyRanksDataRepository: Repository<DailyRanksData>, serverRanksRepository: Repository<ServerRank>);
    updateRanks(): Promise<void>;
    private updateServerRank;
    private updateHighLowRanks;
}
