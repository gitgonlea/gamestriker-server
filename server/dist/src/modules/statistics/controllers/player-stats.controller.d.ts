import { PlayerStatsService } from '../services/player-stats.service';
import { PlayerStatsQueryDto } from '../dto/player-stats.dto';
export declare class PlayerStatsController {
    private readonly playerStatsService;
    constructor(playerStatsService: PlayerStatsService);
    getPlayerStats(query: PlayerStatsQueryDto): Promise<any[]>;
}
