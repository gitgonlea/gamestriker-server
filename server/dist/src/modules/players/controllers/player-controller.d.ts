import { PlayersService } from '../services/players.service';
import { GetPlayerQueryDto } from '../dto/player.dto';
export declare class PlayerController {
    private readonly playersService;
    constructor(playersService: PlayersService);
    getPlayer(query: GetPlayerQueryDto): Promise<{
        players: any[];
        totalPages: number;
    }>;
}
