import { Server } from '../../servers/entities/server.entity';
export declare class DailyMapData {
    id: number;
    server_id: number;
    map_data: string;
    date: Date;
    server: Server;
}
