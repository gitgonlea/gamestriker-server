export declare class AddServerDto {
    host: string;
}
export declare class GetServersQueryDto {
    page?: number;
    pageSize?: number;
    name?: string;
    map?: string;
    ip?: string;
    varKey?: string;
    varValue?: string;
    orderBy?: string;
    orderDirection?: string;
}
export declare class ServerInfoDto {
    host: string;
    port: string;
}
export declare class ServerPlayersQueryDto {
    id: string;
    type?: string;
}
export declare class ServerResponse {
    id: number;
    host: string;
    port: number;
    servername: string;
    map: string;
    maxplayers: number;
    numplayers: number;
    rank_id: number;
    status: number;
    last_update?: string;
    percentile?: number;
    monthly_avg?: number;
    ServerRanks?: any;
    WeeklyMapData?: any;
}
