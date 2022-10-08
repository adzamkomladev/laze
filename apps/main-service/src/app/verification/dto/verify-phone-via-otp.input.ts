import { InputType, Field } from '@nestjs/graphql';

import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { OtpType } from '../enums/otp-type.enum';

@InputType()
export class VerifyPhoneViaOtpInput {
  @Field({ description: 'OTP code sent' })
  @IsNotEmpty()
  @MaxLength(7)
  @MinLength(6)
  readonly code: string;

  @Field(() => OtpType, {
    description: 'Type of medium the otp code was sent via',
  })
  @IsNotEmpty()
  @IsEnum(OtpType)
  readonly type: OtpType;
}
