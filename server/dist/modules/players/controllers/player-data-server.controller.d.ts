import { PlayersService } from '../services/players.service';
import { PlayerDataServerDto } from '../dto/player-data-server.dto';
export declare class PlayerDataServerController {
    private readonly playersService;
    constructor(playersService: PlayersService);
    getPlayerDataServer(query: PlayerDataServerDto): Promise<any>;
}
