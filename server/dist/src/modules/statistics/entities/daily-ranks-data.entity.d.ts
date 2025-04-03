import { Server } from '../../servers/entities/server.entity';
export declare class DailyRanksData {
    id: number;
    date: Date;
    rank_id: number;
    server_id: number;
    server: Server;
}
