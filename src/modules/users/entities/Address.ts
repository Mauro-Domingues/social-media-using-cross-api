import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity('addresses')
export default class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  user_id: string;

  @Column({
    type: 'enum',
    enum: ['address', 'billing_address', 'shipping_address'],
  })
  type: 'address' | 'billing_address' | 'shipping_address';

  @Column({ type: 'varchar' })
  street: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'varchar' })
  district: string;

  @Column({ type: 'varchar', nullable: true })
  complement: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar', length: 2 })
  uf: string;

  @Column({ type: 'varchar', nullable: true })
  zipcode: number;

  @Column({ type: 'int', nullable: true })
  lat: number;

  @Column({ type: 'int', nullable: true })
  lon: number;

  @ManyToOne(() => User, user => user.addresses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Exclude()
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;
}
