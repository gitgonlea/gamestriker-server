import { Server } from './server.entity';
export declare class ServerRank {
    id: number;
    server_id: number;
    lowest_rank: number;
    highest_rank: number;
    month: number;
    year: number;
    server: Server;
}
