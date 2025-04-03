// src/modules/players/entities/daily-player-time-server-data.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Server } from '../../servers/entities/server.entity';

@Entity({ name: 'daily_player_time_server_data' })
export class DailyPlayerTimeServerData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ default: null, nullable: true })
  hour_24: number;

  @Column({ default: null, nullable: true })
  hour_23: number;

  @Column({ default: null, nullable: true })
  hour_22: number;

  @Column({ default: null, nullable: true })
  hour_21: number;

  @Column({ default: null, nullable: true })
  hour_20: number;

  @Column({ default: null, nullable: true })
  hour_19: number;

  @Column({ default: null, nullable: true })
  hour_18: number;

  @Column({ default: null, nullable: true })
  hour_17: number;

  @Column({ default: null, nullable: true })
  hour_16: number;

  @Column({ default: null, nullable: true })
  hour_15: number;

  @Column({ default: null, nullable: true })
  hour_14: number;

  @Column({ default: null, nullable: true })
  hour_13: number;

  @Column({ default: null, nullable: true })
  hour_12: number;

  @Column({ default: null, nullable: true })
  hour_11: number;

  @Column({ default: null, nullable: true })
  hour_10: number;

  @Column({ default: null, nullable: true })
  hour_9: number;

  @Column({ default: null, nullable: true })
  hour_8: number;

  @Column({ default: null, nullable: true })
  hour_7: number;

  @Column({ default: null, nullable: true })
  hour_6: number;

  @Column({ default: null, nullable: true })
  hour_5: number;

  @Column({ default: null, nullable: true })
  hour_4: number;

  @Column({ default: null, nullable: true })
  hour_3: number;

  @Column({ default: null, nullable: true })
  hour_2: number;

  @Column({ default: null, nullable: true })
  hour_1: number;

  @Column()
  server_id: number;

  @Column({ length: 50, nullable: true })
  player_name: string;

  @ManyToOne(() => Server, server => server, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'server_id' })
  server: Server;
}