interface GetPlayersParams {
    name?: string;
    online?: boolean;
    page?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: string;
}
export declare function getPlayers({ name, online, page, pageSize, orderBy, orderDirection }?: GetPlayersParams): Promise<any>;
export declare function getPlayerDetails(playerName: string): Promise<any>;
export declare function getPlayerServerStats(playerName: string, host: string, port: string, days?: number): Promise<any>;
export {};
