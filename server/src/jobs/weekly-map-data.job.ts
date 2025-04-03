import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DailyMapData } from '../modules/statistics/entities/daily-map-data.entity';
import { WeeklyMapData } from '../modules/statistics/entities/weekly-map-data.entity';

@Injectable()
export class WeeklyMapDataJob {
  private readonly logger = new Logger(WeeklyMapDataJob.name);

  constructor(
    @InjectRepository(DailyMapData)
    private readonly dailyMapDataRepository: Repository<DailyMapData>,
    @InjectRepository(WeeklyMapData)
    private readonly weeklyMapDataRepository: Repository<WeeklyMapData>,
  ) {}

  /**
   * Aggregate daily map data into weekly statistics
   * Run once per week on Sunday at midnight
   */
  @Cron('0 0 * * 0') // Every Sunday at midnight
  async aggregateWeeklyMapData(): Promise<void> {
    try {
      this.logger.log('Starting weekly map data aggregation job');
      
      // Calculate date range for the past 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      // Fetch daily map data within the date range
      const dailyMapData = await this.dailyMapDataRepository.find({
        where: {
          date: Between(startDate, endDate)
        }
      });
      
      // Aggregate the results
      const aggregatedResults = this.aggregateResults(dailyMapData);
      
      // Update or create weekly map data records
      for (const result of aggregatedResults) {
        await this.weeklyMapDataRepository.upsert(
          {
            server_id: result.serverId,
            map_data: JSON.stringify(result.mapData)
          },
          { conflictPaths: ['server_id'] }
        );
      }
      
      this.logger.log(`Weekly map data updated for ${aggregatedResults.length} servers`);
    } catch (error) {
      this.logger.error(`Error aggregating weekly map data: ${error.message}`);
    }
  }
  
  /**
   * Aggregate daily map data into weekly statistics
   */
  private aggregateResults(results: DailyMapData[]): Array<{ serverId: number; mapData: any[] }> {
    // Aggregate results for each server_id
    const mapCountsByServer = new Map<number, Map<string, number>>();
    
    // Process each daily record
    for (const result of results) {
      const serverId = result.server_id;
      let mapData: Record<string, number>;
      
      try {
        mapData = JSON.parse(result.map_data || '{}');
      } catch (error) {
        this.logger.warn(`Invalid map data JSON for server ${serverId}: ${error.message}`);
        continue;
      }
      
      // Initialize map for this server if needed
      if (!mapCountsByServer.has(serverId)) {
        mapCountsByServer.set(serverId, new Map<string, number>());
      }
      
      const mapCounts = mapCountsByServer.get(serverId);
      
      // Add map counts to the aggregated data
      for (const [mapName, count] of Object.entries(mapData)) {
        if (mapCounts.has(mapName)) {
          mapCounts.set(mapName, mapCounts.get(mapName) + count);
        } else {
          mapCounts.set(mapName, count);
        }
      }
    }
    
    // Convert aggregated results to array format
    const aggregatedResults = [];
    
    for (const [serverId, mapCounts] of mapCountsByServer.entries()) {
      // Sort maps by count (descending)
      const sortedMapCounts = [...mapCounts.entries()]
        .sort((a, b) => b[1] - a[1]);
      
      // Take top 5 maps
      const topMaps = sortedMapCounts.slice(0, 5);
      
      // Calculate total and "others" count
      let othersCount = 0;
      let totalCount = 0;
      
      // Get total from all maps
      for (const [_, count] of sortedMapCounts) {
        totalCount += count;
      }
      
      // Sum up remaining maps as "others"
      for (let i = 5; i < sortedMapCounts.length; i++) {
        othersCount += sortedMapCounts[i][1];
      }
      
      // Format the map data with percentages
      const mapData = topMaps.map(([name, count]) => ({
        name,
        count,
        value: Math.round((count / totalCount) * 100)
      }));
      
      // Add "others" category if there are more than 5 maps
      if (othersCount > 0) {
        mapData.push({
          name: 'otros',
          count: othersCount,
          value: Math.round((othersCount / totalCount) * 100)
        });
      }
      
      aggregatedResults.push({ serverId, mapData });
    }
    
    return aggregatedResults;
  }
}