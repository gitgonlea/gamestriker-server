import type { ServerDetail, ServerPlayer, PlayerData, ServerResponse, GetServersParams } from '@/types/server';
export declare function getServers({ queryId, value, varValue, page, orderBy, orderDirection }?: GetServersParams): Promise<ServerResponse>;
export declare function getServerDetails(host: string, port: string): Promise<ServerDetail[]>;
export declare function getServerPlayers(serverId: number): Promise<ServerPlayer[]>;
export declare function getServerTop(serverId: number): Promise<ServerPlayer[]>;
export declare function getPlayerStats(serverId: number, type?: number): Promise<PlayerData[]>;
export declare function getRankStats(serverId: number): Promise<any[]>;
export declare function addServer(formData: {
    host: string;
}): Promise<any>;
export declare function getServerVariables(host: string, port: string): Promise<any>;
