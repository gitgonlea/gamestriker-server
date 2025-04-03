import { ConfigService } from '@nestjs/config';
export declare class ServerVariablesService {
    private configService;
    private readonly logger;
    private readonly timeout;
    constructor(configService: ConfigService);
    fetchServerVariables(host: string, port: number): Promise<string | null>;
    fetchServerVariablesFromAPI(host: string, port: number): Promise<string | null>;
}
