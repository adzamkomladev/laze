import { registerEnumType } from '@nestjs/graphql';

export enum OtpType {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
}

registerEnumType(OtpType, {
  name: 'OtpType',
  description: 'Type of medium otp code will be sent via',
});
