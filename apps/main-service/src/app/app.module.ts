import { Module } from '@nestjs/common';

import { GlobalModule } from './@common/modules/global.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { AppService } from './app.service';

import { EmailReroutedListener } from './email-rerouted.listener';

import { SmsConsumer } from './sms.consumer';

import { AppController } from './app.controller';

@Module({
  imports: [GlobalModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, SmsConsumer, EmailReroutedListener],
})
export class AppModule {}
