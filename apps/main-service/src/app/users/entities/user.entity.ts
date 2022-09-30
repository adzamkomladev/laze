import { ObjectType, Field, ID } from '@nestjs/graphql';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Entity,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

import { Profile } from './profile.entity';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID, { description: 'This is the ID of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne((type) => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20, nullable: true, unique: true })
  phone?: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();

      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
