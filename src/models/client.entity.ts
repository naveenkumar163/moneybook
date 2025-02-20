import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Agent } from './agent.entity';

@Entity({ name: 'Client_Master' }) // ✅ Custom table name
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Agent, (agent) => agent.clients, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' }) // ✅ Foreign Key
  agent: Agent;
}
