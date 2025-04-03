import { Server } from '../../servers/entities/server.entity';
export declare class PlayerData {
    id: number;
    server_id: number;
    player_name: string;
    playtime: number;
    score: number;
    previous_playtime: number;
    previous_score: number;
    online: number;
    last_seen: Date;
    first_seen: Date;
    current_playtime: number;
    current_score: number;
    BOT: number;
    server: Server;
}
