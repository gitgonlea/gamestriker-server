import { PlayerData } from '../../players/entities/player-data.entity';
import { ServerRank } from './server-rank.entity';
import { WeeklyMapData } from '../../statistics/entities/weekly-map-data.entity';
import { DailyMapData } from '../../statistics/entities/daily-map-data.entity';
import { DailyPlayerData } from '../../statistics/entities/daily-player-data.entity';
import { DailyRanksData } from '../../statistics/entities/daily-ranks-data.entity';
import { DailyServerVariables } from './daily-server-variables.entity';
export declare class Server {
    id: number;
    host: string;
    port: number;
    servername: string;
    map: string;
    maxplayers: number;
    numplayers: number;
    rank_id: number;
    status: number;
    last_update: string;
    playerData: PlayerData[];
    serverRanks: ServerRank[];
    weeklyMapData: WeeklyMapData[];
    dailyMapData: DailyMapData[];
    dailyPlayerData: DailyPlayerData[];
    dailyRanksData: DailyRanksData[];
    dailyServerVariables: DailyServerVariables[];
}
