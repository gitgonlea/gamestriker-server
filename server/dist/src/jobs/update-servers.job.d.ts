import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Server } from '../modules/servers/entities/server.entity';
import { ServersService } from '../modules/servers/services/servers.service';
import { WebsocketGateway } from '../modules/realtime/gateways/websocket.gateway';
export declare class UpdateServersJob {
    private readonly configService;
    private readonly serversService;
    private readonly websocketGateway;
    private readonly serverRepository;
    private readonly logger;
    private readonly updateInterval;
    private readonly minDelay;
    private readonly maxDelay;
    constructor(configService: ConfigService, serversService: ServersService, websocketGateway: WebsocketGateway, serverRepository: Repository<Server>);
    updateServers(): Promise<void>;
    private getRandomDelay;
}
