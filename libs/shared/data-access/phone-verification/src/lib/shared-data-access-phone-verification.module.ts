import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SharedDataAccessArkeselModule } from '@laze/nestjs-arkesel';

import { PhoneVerificationService } from './services';

import phoneVerificationConfig from './configs/phone-verification.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [phoneVerificationConfig],
    }),
    SharedDataAccessArkeselModule,
  ],
  providers: [PhoneVerificationService],
  exports: [PhoneVerificationService],
})
export class SharedDataAccessPhoneVerificationModule {}
