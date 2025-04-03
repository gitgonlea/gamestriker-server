// src/jobs/update-ranks.job.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Server } from '../modules/servers/entities/server.entity';
import { PlayerData } from '../modules/players/entities/player-data.entity';
import { DailyRanksData } from '../modules/statistics/entities/daily-ranks-data.entity';
import { ServerRank } from '../modules/servers/entities/server-rank.entity';

@Injectable()
export class UpdateRanksJob {
  private readonly logger = new Logger(UpdateRanksJob.name);

  constructor(
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    @InjectRepository(PlayerData)
    private readonly playerDataRepository: Repository<PlayerData>,
    @InjectRepository(DailyRanksData)
    private readonly dailyRanksDataRepository: Repository<DailyRanksData>,
    @InjectRepository(ServerRank)
    private readonly serverRanksRepository: Repository<ServerRank>,
  ) {}

  /**
   * Update server rankings twice daily
   * Based on total playtime of non-bot players
   */
  @Cron('0 6,18 * * *') // Run at 6:00 AM and 6:00 PM
  async updateRanks(): Promise<void> {
    try {
      this.logger.log('Starting server ranks update job');

      // Get servers ordered by total player playtime
      const servers = await this.playerDataRepository
        .createQueryBuilder('player')
        .select('player.server_id')
        .addSelect('SUM(player.playtime)', 'total_playtime')
        .where('player.BOT = 0')
        .groupBy('player.server_id')
        .orderBy('total_playtime', 'DESC')
        .getRawMany();

      // Update each server's rank
      for (let i = 0; i < servers.length; i++) {
        const server = servers[i];
        const rank = i + 1;
        
        await this.updateServerRank(server.server_id, rank);
      }

      this.logger.log(`Server ranks updated for ${servers.length} servers`);
    } catch (error) {
      this.logger.error(`Error updating server ranks: ${error.message}`);
    }
  }

  /**
   * Update an individual server's rank
   */
  private async updateServerRank(serverId: number, rank: number): Promise<void> {
    try {
      // Update the server's rank
      await this.serverRepository.update(serverId, { rank_id: rank });

      // Record the rank in daily ranks data
      await this.dailyRanksDataRepository.upsert(
        {
          server_id: serverId,
          rank_id: rank,
          date: new Date() // Usamos la fecha actual en lugar de CURDATE()
        },
        { conflictPaths: ['server_id', 'date'] }
      );

      // Update high/low rank metrics
      await this.updateHighLowRanks(serverId, rank);
    } catch (error) {
      this.logger.error(`Error updating rank for server ${serverId}: ${error.message}`);
    }
  }

  /**
   * Track the highest and lowest ranks for a server in the current month
   */
  private async updateHighLowRanks(serverId: number, rank: number): Promise<void> {
    try {
      const currentDate = moment().tz('America/Argentina/Buenos_Aires');
      const currentMonth = currentDate.month() + 1;
      const currentYear = currentDate.year();

      // Find o create record for current month/year
      let serverRank = await this.serverRanksRepository.findOne({
        where: { 
          server_id: serverId, 
          month: currentMonth, 
          year: currentYear 
        }
      });

      if (!serverRank) {
        serverRank = this.serverRanksRepository.create({
          server_id: serverId, 
          month: currentMonth, 
          year: currentYear,
          lowest_rank: rank,
          highest_rank: rank
        });
        await this.serverRanksRepository.save(serverRank);
      } else {
        // Update highest/lowest if necessary
        let { highest_rank, lowest_rank } = serverRank;
        
        // Lower rank number is better (e.g., #1 is better than #10)
        // So highest rank is the minimum value, lowest rank is the maximum value
        if (rank < lowest_rank) {
          lowest_rank = rank;
        }
        
        if (rank > highest_rank) {
          highest_rank = rank;
        }
        
        await this.serverRanksRepository.update(
          { id: serverRank.id },
          { lowest_rank, highest_rank }
        );
      }
    } catch (error) {
      this.logger.error(`Error updating high/low ranks for server ${serverId}: ${error.message}`);
    }
  }
}