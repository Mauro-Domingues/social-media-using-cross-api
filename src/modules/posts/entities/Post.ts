import Profile from '@modules/users/entities/Profile';
import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '@config/upload';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Comment from './Comment';

@Entity('posts')
export default class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: false })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  profile_id: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  image: string;

  @ManyToOne(() => Profile, profile => profile.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => Comment, comment => comment.post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: Comment[];

  @Expose({ name: 'image_url' })
  getAvatarUrl(): string | null {
    if (!this.image) {
      return null;
    }
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.API_URL}/files/${this.image}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.image}`;
      default:
        return null;
    }
  }

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;
}
