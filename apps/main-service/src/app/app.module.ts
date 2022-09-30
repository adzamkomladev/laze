import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailConsumer } from './email.consumer';
import { SmsConsumer } from './sms.consumer';
import { EmailReroutedListener } from './email-rerouted.listener';
import { Notification } from './notification.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () =>
        ({
          ...environment.database,
        } as TypeOrmModuleOptions),
    }),
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
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Notification]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailConsumer, SmsConsumer, EmailReroutedListener],
})
export class AppModule {}
