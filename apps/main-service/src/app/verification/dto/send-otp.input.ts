import { InputType, Field } from '@nestjs/graphql';

import { IsEnum, IsNotEmpty } from 'class-validator';

import { OtpType } from '../enums/otp-type.enum';

@InputType()
export class SendOtpInput {
  @Field(() => OtpType, {
    description: 'Type of medium the otp code is going to be sent via',
  })
  @IsNotEmpty()
  @IsEnum(OtpType)
  readonly type: OtpType;
}
