import { InputType, Field } from '@nestjs/graphql';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Match } from '../../@common/decorators/match.decorator';
import { UniqueEmail } from '../decorators/unique-email.decorator';
import { UniquePhone } from '../decorators/unique-phone.decorator';

import { NameInput } from './name.input';

@InputType()
export class SignUpViaEmailInput {
  @Field({ description: 'Email address to create account with' })
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  @UniqueEmail()
  readonly email: string;

  @Field({ description: 'Phone number of user' })
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(20)
  @UniquePhone()
  readonly phone?: string;

  @Field(() => NameInput, { description: 'Name of user' })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => NameInput)
  readonly name: NameInput;

  @Field({ description: 'Password to create account with' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  readonly password: string;

  @Field({ description: 'Confirm password to create account with' })
  @IsNotEmpty()
  @Match(SignUpViaEmailInput, (i) => i.password, {
    message: 'confirmPassword and password does not match',
  })
  readonly confirmPassword: string;
}
