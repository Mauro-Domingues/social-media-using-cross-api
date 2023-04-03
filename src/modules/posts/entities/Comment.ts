import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Profile from '@modules/users/entities/Profile';
import { Exclude } from 'class-transformer';
import Post from './Post';
import Answer from './Answer';

@Entity('comments')
export default class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  profile_id: string;

  @Column({ type: 'varchar', nullable: true })
  post_id: string;

  @ManyToOne(() => Profile, profile => profile.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToOne(() => Post, post => post.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => Answer, answer => answer.comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  answers: Answer[];

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;
}
