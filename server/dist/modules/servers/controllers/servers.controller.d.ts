import { ServersService } from '../services/servers.service';
import { AddServerDto, GetServersQueryDto, ServerInfoDto, ServerPlayersQueryDto } from '../dto/server.dto';
export declare class ServersController {
    private readonly serversService;
    constructor(serversService: ServersService);
    addServer(addServerDto: AddServerDto): Promise<any>;
    getServers(query: GetServersQueryDto): Promise<{
        servers: import("../entities/server.entity").Server[];
        totalPages: number;
    }>;
    getServerInfo(query: ServerInfoDto): Promise<import("../entities/server.entity").Server[]>;
    getServerPlayers(query: ServerPlayersQueryDto): Promise<import("../../players/entities/player-data.entity").PlayerData[]>;
    getServerVariables(host: string, port: string): Promise<any[]>;
}
