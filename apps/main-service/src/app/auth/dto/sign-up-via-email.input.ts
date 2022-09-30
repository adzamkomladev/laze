import { InputType, Field } from '@nestjs/graphql';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';

@InputType()
export class SignUpViaEmailInput {
  @Field(() => String, { description: 'Email address to create account with' })
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  readonly email: string;

  @Field(() => String, { description: 'Phone number of user' })
  @IsOptional()
  @MaxLength(20)
  readonly phone?: string;

  @Field(() => String, { description: 'Password to create account with' })
  @IsNotEmpty()
  readonly password: string;

  @Field(() => String, { description: 'Password to create account with' })
  @IsNotEmpty()
  readonly confirmPassword: string;
}
