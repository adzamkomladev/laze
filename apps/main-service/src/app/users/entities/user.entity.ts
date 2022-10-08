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
import { UserVerification } from '../../verification/entities/user-verification.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID, { description: 'This is the ID of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ description: 'User Profile' })
  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @Field({ description: 'User Verification Info' })
  @OneToOne(() => UserVerification, (verification) => verification.user)
  @JoinColumn()
  verification: UserVerification;

  @Field({ description: 'Email address of user' })
  @Column({ length: 100, unique: true })
  email: string;

  @Field({ description: 'Phone number of user', nullable: true })
  @Column({ length: 20, nullable: true, unique: true })
  phone?: string;

  @Column()
  @Exclude()
  password: string;

  @Field({ description: 'Datetime user was created', nullable: true })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'Datetime user was last updated', nullable: true })
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
