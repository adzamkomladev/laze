import { InputType, Field } from '@nestjs/graphql';

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class NameInput {
  @Field({ description: 'First name of user signing up' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly first: string;

  @Field({ description: 'Last name of user signing up' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly last: string;

  @Field({ description: 'Other names of user signing up', nullable: true })
  @IsOptional()
  @MaxLength(100)
  readonly other?: string;
}
