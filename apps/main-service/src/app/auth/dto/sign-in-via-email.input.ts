import { InputType, Field } from '@nestjs/graphql';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class SignInViaEmailInput {
  @Field({ description: 'Email address to sign into account with' })
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  readonly email: string;

  @Field({ description: 'Password to sign into account with' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  readonly password: string;
}
