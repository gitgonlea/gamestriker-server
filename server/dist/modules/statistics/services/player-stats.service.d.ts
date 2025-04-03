import { Repository } from 'typeorm';
import { DailyPlayerData } from '../entities/daily-player-data.entity';
import { PlayerStatsQueryDto } from '../dto/player-stats.dto';
export declare class PlayerStatsService {
    private readonly dailyPlayerDataRepository;
    private readonly logger;
    constructor(dailyPlayerDataRepository: Repository<DailyPlayerData>);
    getPlayerStats(query: PlayerStatsQueryDto): Promise<any[]>;
    private getDailyStats;
    private getPeriodStats;
}
