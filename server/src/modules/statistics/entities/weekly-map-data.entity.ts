import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Server } from '../../servers/entities/server.entity';

@Entity({ name: 'weekly_map_data' })
export class WeeklyMapData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  server_id: number;

  @Column({ type: 'longtext', nullable: true })
  map_data: string;

  @ManyToOne(() => Server, server => server, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'server_id' })
  server: Server;
}