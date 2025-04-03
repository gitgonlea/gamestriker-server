// src/modules/players/entities/player-data.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Server } from '../../servers/entities/server.entity';

@Entity({ name: 'player_data' })
export class PlayerData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  server_id: number;

  @Column({ length: 255, collation: 'utf8mb4_general_ci' })
  player_name: string;

  @Column({ default: 0 })
  playtime: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  previous_playtime: number;

  @Column({ default: 0 })
  previous_score: number;

  @Column({ default: 0 })
  online: number;

  @Column({ type: 'datetime', nullable: true })
  last_seen: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  first_seen: Date;

  @Column({ default: 0 })
  current_playtime: number;

  @Column({ default: 0 })
  current_score: number;

  @Column({ default: 0 })
  BOT: number;

  @ManyToOne(() => Server, server => server.playerData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'server_id' })
  server: Server;
}