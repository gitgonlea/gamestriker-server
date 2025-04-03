import { Server } from '../../servers/entities/server.entity';
export declare class DailyPlayerData {
    id: number;
    date: Date;
    hour_24: number;
    hour_22: number;
    hour_20: number;
    hour_18: number;
    hour_16: number;
    hour_14: number;
    hour_12: number;
    hour_10: number;
    hour_8: number;
    hour_6: number;
    hour_4: number;
    hour_2: number;
    server_id: number;
    server: Server;
}
