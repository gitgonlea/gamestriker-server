import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Server } from '../../servers/entities/server.entity';

@Entity({ name: 'daily_player_data' })
export class DailyPlayerData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ default: -1 })
  hour_24: number;

  @Column({ default: -1 })
  hour_22: number;

  @Column({ default: -1 })
  hour_20: number;

  @Column({ default: -1 })
  hour_18: number;

  @Column({ default: -1 })
  hour_16: number;

  @Column({ default: -1 })
  hour_14: number;

  @Column({ default: -1 })
  hour_12: number;

  @Column({ default: -1 })
  hour_10: number;

  @Column({ default: -1 })
  hour_8: number;

  @Column({ default: -1 })
  hour_6: number;

  @Column({ default: -1 })
  hour_4: number;

  @Column({ default: -1 })
  hour_2: number;

  @Column({ default: -1 })
  server_id: number;

  @ManyToOne(() => Server, server => server, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'server_id' })
  server: Server;
}