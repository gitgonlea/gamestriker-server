import { Repository } from 'typeorm';
import { Server } from '../entities/server.entity';
export declare class ServerRepository {
    private serverRepository;
    constructor(serverRepository: Repository<Server>);
    findAll(options?: {
        page?: number;
        pageSize?: number;
        name?: string;
        map?: string;
        ip?: string;
        orderBy?: string;
        orderDirection?: boolean;
    }): Promise<{
        servers: Server[];
        totalPages: number;
    }>;
    findById(id: number): Promise<Server>;
    findByHostAndPort(host: string, port: number): Promise<Server>;
    create(data: Partial<Server>): Promise<Server>;
    update(id: number, data: Partial<Server>): Promise<void>;
    remove(id: number): Promise<void>;
    updateRank(id: number, rank: number): Promise<void>;
    count(): Promise<number>;
    countByRank(rank: number): Promise<number>;
}
