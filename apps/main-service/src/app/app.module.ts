import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailConsumer } from './email.consumer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...environment.database,
    } as TypeOrmModuleOptions),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: environment.cache.host,
      port: environment.cache.port,
      db: environment.cache.db,
    }),
    BullModule.forRoot({
      redis: {
        host: environment.queue.host,
        port: environment.queue.port,
        db: environment.queue.db,
      },
      prefix: environment.queue.prefix,
    }),
    BullModule.registerQueue(
      {
        name: 'email',
      },
      {
        name: 'sms',
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService, EmailConsumer],
})
export class AppModule {}
