import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Master } from './master.entity';
import { Client } from './client.entity';

@Entity({ name: 'Agent_Master' }) // ✅ Custom table name
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Master, (master) => master.agents, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'masterId' }) // ✅ Foreign Key
  master: Master;

  @OneToMany(() => Client, (client) => client.agent)
  clients: Client[];
}
