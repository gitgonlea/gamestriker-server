import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Server } from './server.entity';

@Entity({ name: 'server_ranks' })
@Unique(['server_id', 'month', 'year'])
export class ServerRank {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  server_id: number;
  
  @Column({ nullable: true })
  lowest_rank: number;
  
  @Column({ nullable: true })
  highest_rank: number;
  
  @Column({ nullable: true })
  month: number;
  
  @Column({ nullable: true })
  year: number;
  
  @ManyToOne(() => Server, server => server.serverRanks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'server_id' })
  server: Server;
}