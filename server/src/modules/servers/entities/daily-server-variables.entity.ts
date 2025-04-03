import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Server } from './server.entity';

@Entity({ name: 'daily_server_variables' })
export class DailyServerVariables {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  server_id: number;

  @Column({ type: 'longtext', nullable: true, collation: 'utf8mb4_bin' })
  variables_data: string;
  
  @ManyToOne(() => Server, server => server.dailyServerVariables, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'server_id' })
  server: Server;
}