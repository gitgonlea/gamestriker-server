// src/jobs/update-servers.job.ts
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from '../modules/servers/entities/server.entity';
import { ServersService } from '../modules/servers/services/servers.service';
import { WebsocketGateway } from '../modules/realtime/gateways/websocket.gateway';

@Injectable()
export class UpdateServersJob {
  private readonly logger = new Logger(UpdateServersJob.name);
  private readonly updateInterval: number;
  private readonly minDelay: number = 10 * 1000; // 10 seconds
  private readonly maxDelay: number = 60 * 1000; // 60 seconds

  constructor(
    private readonly configService: ConfigService,
    private readonly serversService: ServersService,
    private readonly websocketGateway: WebsocketGateway,
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
  ) {
    this.updateInterval = this.configService.get<number>('server.updateInterval') || 15 * 60 * 1000;
  }

  /**
   * Scheduled job to update all servers
   * Uses dynamic delay to distribute server queries over time
   */
  @Interval('updateServers', 15 * 60 * 1000) // Default: 15 minutes
  async updateServers(): Promise<void> {
    try {
      this.logger.log('Starting server update job');
      
      // Fetch all servers
      const servers = await this.serverRepository.find();
      
      // Process each server with a random delay
      for (const [index, server] of servers.entries()) {
        const delay = this.getRandomDelay(this.minDelay, this.maxDelay);
        
        // Schedule processing without waiting
        setTimeout(async () => {
          try {
            await this.serversService.updateServer(server);
            
            // Notify connected clients
            this.websocketGateway.notifyServerUpdated(`${server.host}:${server.port}`);
            
            this.logger.debug(`Updated server ${server.id} (${server.servername})`);
          } catch (error) {
            this.logger.error(`Error updating server ${server.id}: ${error.message}`);
          }
        }, delay);
      }
    } catch (error) {
      this.logger.error(`Error in server update job: ${error.message}`);
    }
  }

  /**
   * Generate a random delay between min and max values
   */
  private getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}