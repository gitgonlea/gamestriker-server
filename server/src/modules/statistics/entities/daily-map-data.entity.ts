import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Server } from '../../servers/entities/server.entity';

@Entity({ name: 'daily_map_data' })
export class DailyMapData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  server_id: number;

  @Column({ type: 'longtext', nullable: true, collation: 'utf8mb4_bin' })
  map_data: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @ManyToOne(() => Server, server => server, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'server_id' })
  server: Server;
}