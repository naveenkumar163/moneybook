import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Master } from './master.entity';

@Entity({ name: 'Admin_Master' }) // ✅ Custom table name
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Master, (master) => master.admin)
  masters: Master[];
}
