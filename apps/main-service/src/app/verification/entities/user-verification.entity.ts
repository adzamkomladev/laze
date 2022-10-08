import { ObjectType, Field, ID } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class UserVerification {
  @Field(() => ID, {
    description: 'This is the ID of the user verification info',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User, {
    description: 'Owner of verification info',
    nullable: true,
  })
  @OneToOne(() => User, (user) => user.verification)
  user: User;

  @Field({ description: 'Is Email address of user verified' })
  @Column({ default: false })
  email: boolean;

  @Field({
    description: 'Datetime user email address was verified',
    nullable: true,
  })
  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Field({ description: 'Is Phone number of user verified' })
  @Column({ default: false })
  phone: boolean;

  @Field({
    description: 'Datetime user phone number was verified',
    nullable: true,
  })
  @Column({ nullable: true })
  phoneVerifiedAt: Date;

  @Field({ description: 'Datetime verification was created', nullable: true })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'Datetime verification was last updated', nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;
}
