import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from '../../users/entities/user.entity';
import { Name } from '../../@common/entities/name.entity';
import { Address } from '../../@common/entities/address.entity';

import { Sex } from '../../@common/enums/sex.enum';

@Entity()
@ObjectType()
export class Profile {
  @Field(() => ID, {
    description: 'This is the ID of the user profile',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User, { description: 'Owner of profile', nullable: true })
  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Field(() => Name, { description: 'Name profile of user', nullable: true })
  @Column(() => Name)
  name?: Name;

  @Field(() => Sex, { description: 'Sex profile of user', nullable: true })
  @Column({ type: 'enum', enum: Sex, nullable: true })
  sex?: Sex;

  @Field({ description: 'Display avatar url of the profile', nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field(() => Address, {
    description: 'Address profile of user',
    nullable: true,
  })
  @Column(() => Address)
  address?: Address;

  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'Date profile was last updated', nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @BeforeInsert()
  generateAvatar() {
    this.avatar = `https://ui-avatars.com/api/?name=${this.name.first}+${this.name.last}`;
  }
}
