import { Repository } from 'typeorm';
import { DailyMapData } from '../modules/statistics/entities/daily-map-data.entity';
import { WeeklyMapData } from '../modules/statistics/entities/weekly-map-data.entity';
export declare class WeeklyMapDataJob {
    private readonly dailyMapDataRepository;
    private readonly weeklyMapDataRepository;
    private readonly logger;
    constructor(dailyMapDataRepository: Repository<DailyMapData>, weeklyMapDataRepository: Repository<WeeklyMapData>);
    aggregateWeeklyMapData(): Promise<void>;
    private aggregateResults;
}
