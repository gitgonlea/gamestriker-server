import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Server } from '../entities/server.entity';

@Injectable()
export class ServerRepository {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
  ) {}

  async findAll(options?: {
    page?: number;
    pageSize?: number;
    name?: string;
    map?: string;
    ip?: string;
    orderBy?: string;
    orderDirection?: boolean;
  }): Promise<{ servers: Server[]; totalPages: number }> {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const orderBy = options?.orderBy || 'numplayers';
    const orderDirection = options?.orderDirection !== undefined ? options.orderDirection : true;
    
    const queryOptions: any = {
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        [orderBy]: orderDirection ? 'DESC' : 'ASC',
      },
    };
    
    // Build where conditions
    const where: FindOptionsWhere<Server> = {};
    
    if (options?.name) {
      where.servername = Like(`%${options.name}%`);
    }
    
    if (options?.map) {
      where.map = Like(`%${options.map}%`);
    }
    
    if (options?.ip) {
      const [host, port] = options.ip.split(':');
      if (host && port) {
        where.host = host;
        where.port = parseInt(port, 10);
      } else {
        where.host = Like(`%${options.ip}%`);
      }
    }
    
    if (Object.keys(where).length > 0) {
      queryOptions.where = where;
    }
    
    // Query with count
    const [servers, total] = await this.serverRepository.findAndCount(queryOptions);
    
    return {
      servers,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: number): Promise<Server> {
    return this.serverRepository.findOne({ where: { id } });
  }

  async findByHostAndPort(host: string, port: number): Promise<Server> {
    return this.serverRepository.findOne({ where: { host, port } });
  }

  async create(data: Partial<Server>): Promise<Server> {
    const server = this.serverRepository.create(data);
    return this.serverRepository.save(server);
  }

  async update(id: number, data: Partial<Server>): Promise<void> {
    await this.serverRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.serverRepository.delete(id);
  }
  
  async updateRank(id: number, rank: number): Promise<void> {
    await this.serverRepository.update(id, { rank_id: rank });
  }
  
  async count(): Promise<number> {
    return this.serverRepository.count();
  }
  
  async countByRank(rank: number): Promise<number> {
    return this.serverRepository.count({
      where: {
        rank_id: MoreThanOrEqual(rank),
      },
    });
  }
}