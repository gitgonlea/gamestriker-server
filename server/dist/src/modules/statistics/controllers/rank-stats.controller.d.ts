import { RankStatsService } from '../services/rank-stats.service';
import { RankStatsQueryDto } from '../dto/rank-stats.dto';
export declare class RankStatsController {
    private readonly rankStatsService;
    constructor(rankStatsService: RankStatsService);
    getRankStats(query: RankStatsQueryDto): Promise<any[]>;
}
