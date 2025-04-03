import { ConfigService } from '@nestjs/config';
import { ServerInfo } from '../interfaces/server-info.interface';
import { PlayerInfo } from '../interfaces/player-info.interface';
export declare class GameServerService {
    private configService;
    private readonly logger;
    private readonly timeout;
    constructor(configService: ConfigService);
    queryServer(host: string, port: number): Promise<ServerInfo | null>;
    queryServerPlayers(host: string, port: number): Promise<PlayerInfo[]>;
}
