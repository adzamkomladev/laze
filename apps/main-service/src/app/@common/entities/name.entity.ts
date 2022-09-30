import {Column, Index} from 'typeorm';

@Index(['first'])
@Index(['last'])
@Index(['other'])
@Index(['first', 'last'])
@Index(['first', 'last', 'other'])
export class Name {
  @Column()
  first: string;

  @Column()
  last: string;

  @Column({ nullable: true })
  other?: string;
}
