import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Profile from '@modules/users/entities/Profile';
import { Exclude } from 'class-transformer';
import Comment from './Comment';

@Entity('answers')
export default class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  profile_id: string;

  @Column({ type: 'varchar', nullable: true })
  comment_id: string;

  @ManyToOne(() => Profile, profile => profile.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => Comment, comment => comment.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;
}
