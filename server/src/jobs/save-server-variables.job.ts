// src/jobs/save-server-variables.job.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from '../modules/servers/entities/server.entity';
import { DailyServerVariables } from '../modules/servers/entities/daily-server-variables.entity';
import { ServerVariablesService } from '../modules/gameserver/services/server-variables.service';

@Injectable()
export class SaveServerVariablesJob {
  private readonly logger = new Logger(SaveServerVariablesJob.name);

  constructor(
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    @InjectRepository(DailyServerVariables)
    private readonly dailyServerVariablesRepository: Repository<DailyServerVariables>,
    private readonly serverVariablesService: ServerVariablesService,
  ) {}

  /**
   * Save extended server variables for all active servers
   * Run once per day at midnight
   */
  @Cron('0 0 * * *') // Every day at midnight
  async saveServerVariables(): Promise<void> {
    try {
      this.logger.log('Starting server variables collection job');
      
      // Get all active servers
      const servers = await this.serverRepository.find({
        where: { status: 1 },
        select: ['id', 'host', 'port']
      });
      
      let successCount = 0;
      
      // Process each server
      for (const server of servers) {
        try {
          // Fetch server variables
          const variables = await this.serverVariablesService.fetchServerVariables(
            server.host,
            server.port
          );
          
          if (variables) {
            // Save or update server variables
            await this.dailyServerVariablesRepository.upsert(
              {
                server_id: server.id,
                variables_data: variables
              },
              { conflictPaths: ['server_id'] }
            );
            
            successCount++;
          }
        } catch (error) {
          this.logger.error(`Error saving variables for server ${server.id}: ${error.message}`);
        }
      }
      
      this.logger.log(`Server variables updated for ${successCount} out of ${servers.length} servers`);
    } catch (error) {
      this.logger.error(`Error in server variables job: ${error.message}`);
    }
  }
}