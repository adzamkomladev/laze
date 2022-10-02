import { Field, ObjectType } from '@nestjs/graphql';

import { Column, Index } from 'typeorm';

@ObjectType()
@Index(['street'])
export class Address {
  @Field({ description: 'Street of address', nullable: true })
  @Column({ nullable: true })
  street?: string;

  @Field({ description: 'City of address', nullable: true })
  @Column({ nullable: true })
  city?: string;

  @Field({ description: 'State of address', nullable: true })
  @Column({ nullable: true })
  state?: string;

  @Field({ description: 'Country of address', nullable: true })
  @Column({ nullable: true })
  country?: string;

  @Field({ description: 'Code of address', nullable: true })
  @Column({ nullable: true })
  code?: string;
}
