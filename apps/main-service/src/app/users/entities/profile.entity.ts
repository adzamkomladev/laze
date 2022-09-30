import { ObjectType, Field, Int } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Name } from '../../@common/entities/name.entity';
import { Address } from '../../@common/entities/address.entity';
import { User } from './user.entity';
import { Sex } from '../../@common/enums/sex.enum';

@Entity()
@ObjectType()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Column(() => Name)
  name?: Name;

  @Column({ type: 'enum', enum: Sex, nullable: true })
  sex?: Sex;

  @Field(() => String, { description: 'Display avatar url of the profile' })
  @Column({ nullable: true })
  avatar?: string;

  @Column(() => Address)
  address?: Address;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
