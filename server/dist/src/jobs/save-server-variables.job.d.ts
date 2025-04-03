import { Repository } from 'typeorm';
import { Server } from '../modules/servers/entities/server.entity';
import { DailyServerVariables } from '../modules/servers/entities/daily-server-variables.entity';
import { ServerVariablesService } from '../modules/gameserver/services/server-variables.service';
export declare class SaveServerVariablesJob {
    private readonly serverRepository;
    private readonly dailyServerVariablesRepository;
    private readonly serverVariablesService;
    private readonly logger;
    constructor(serverRepository: Repository<Server>, dailyServerVariablesRepository: Repository<DailyServerVariables>, serverVariablesService: ServerVariablesService);
    saveServerVariables(): Promise<void>;
}
