import { Column, Index } from 'typeorm';

@Index(['street'])
export class Address {
  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  code?: string;
}
