import { Module } from '@nestjs/common';

import { GlobalModule } from './@common/modules/global.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { AppService } from './app.service';

import { EmailReroutedListener } from './email-rerouted.listener';

import { SmsConsumer } from './sms.consumer';

import { AppController } from './app.controller';
import { VerificationModule } from './verification/verification.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    GlobalModule,
    AuthModule,
    UsersModule,
    VerificationModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, SmsConsumer, EmailReroutedListener],
})
export class AppModule {}
