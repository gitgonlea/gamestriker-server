import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlayerData } from '../../players/entities/player-data.entity';
import { ServerRank } from './server-rank.entity';
import { WeeklyMapData } from '../../statistics/entities/weekly-map-data.entity';
import { DailyMapData } from '../../statistics/entities/daily-map-data.entity';
import { DailyPlayerData } from '../../statistics/entities/daily-player-data.entity';
import { DailyRanksData } from '../../statistics/entities/daily-ranks-data.entity';
import { DailyServerVariables } from './daily-server-variables.entity';

@Entity({ name: 'servers' })
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: true })
  host: string;

  @Column({ nullable: true })
  port: number;

  @Column({ length: 65, nullable: true })
  servername: string;

  @Column({ length: 50, nullable: true })
  map: string;

  @Column({ default: 0 })
  maxplayers: number;

  @Column({ default: 0 })
  numplayers: number;

  @Column({ default: 0 })
  rank_id: number;

  @Column({ default: 1 })
  status: number;

  @Column({ length: 50, nullable: true })
  last_update: string;

  // Relationships
  @OneToMany(() => PlayerData, playerData => playerData.server)
  playerData: PlayerData[];

  @OneToMany(() => ServerRank, serverRank => serverRank.server)
  serverRanks: ServerRank[];

  @OneToMany(() => WeeklyMapData, weeklyMapData => weeklyMapData.server)
  weeklyMapData: WeeklyMapData[];
  
  @OneToMany(() => DailyMapData, dailyMapData => dailyMapData.server)
  dailyMapData: DailyMapData[];
  
  @OneToMany(() => DailyPlayerData, dailyPlayerData => dailyPlayerData.server)
  dailyPlayerData: DailyPlayerData[];
  
  @OneToMany(() => DailyRanksData, dailyRanksData => dailyRanksData.server)
  dailyRanksData: DailyRanksData[];
  
  @OneToMany(() => DailyServerVariables, dailyServerVariables => dailyServerVariables.server)
  dailyServerVariables: DailyServerVariables[];
}