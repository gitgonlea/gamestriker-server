import { Repository } from 'typeorm';
import { DailyRanksData } from '../entities/daily-ranks-data.entity';
import { RankStatsQueryDto } from '../dto/rank-stats.dto';
export declare class RankStatsService {
    private readonly dailyRanksDataRepository;
    private readonly logger;
    constructor(dailyRanksDataRepository: Repository<DailyRanksData>);
    getRankStats(query: RankStatsQueryDto): Promise<any[]>;
}
