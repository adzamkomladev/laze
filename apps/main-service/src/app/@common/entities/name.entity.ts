import { Field, ObjectType } from '@nestjs/graphql';

import { Column, Index } from 'typeorm';

@ObjectType()
@Index(['first'])
@Index(['last'])
@Index(['other'])
@Index(['first', 'last'])
@Index(['first', 'last', 'other'])
export class Name {
  @Field({ description: 'First name' })
  @Column()
  first: string;

  @Field({ description: 'Last name' })
  @Column()
  last: string;

  @Field({ description: 'Other names', nullable: true })
  @Column({ nullable: true })
  other?: string;
}
