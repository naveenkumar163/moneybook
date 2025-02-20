import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Admin } from './admin.entity';
import { Agent } from './agent.entity';

@Entity({ name: 'Master_Master' }) // ✅ Custom table name
export class Master {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Admin, (admin) => admin.masters, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adminId' }) // ✅ Foreign Key
  admin: Admin;

  @OneToMany(() => Agent, (agent) => agent.master)
  agents: Agent[];
}
