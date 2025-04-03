import { ConfigService } from '@nestjs/config';
interface ServerData {
    servername: string;
    host: string;
    port: number | string;
    online: number;
    numplayers: number;
    maxplayers: number;
    rank_id: number;
    map: string;
}
interface PlayerStats {
    day: number;
    hour: string;
    Jugadores: number;
}
export declare class BannerService {
    private configService;
    private readonly logger;
    private readonly bannerOutputPath;
    constructor(configService: ConfigService);
    generateBanner(data: ServerData, playerStats: PlayerStats[]): Promise<void>;
    private truncateText;
    private drawBannerText;
    private generateChartImage;
    private saveBannerImage;
}
export {};
