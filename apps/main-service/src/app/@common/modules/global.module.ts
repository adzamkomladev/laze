import { Module, Global, CacheModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { join } from 'path';
import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { environment } from '../../../environments/environment';

import { Notification } from '../../notification.entity';

import { TokenGenerationService } from '../serices/token-generation.service';

import { EmailConsumer } from '../consumers/email.consumer';

import { Match } from '../validators/match.validator';

@Global()
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
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: environment.mail.host,
        port: environment.mail.port,
        secure: false,
        // auth: {
        //   user: 'user@example.com',
        //   pass: 'topsecret',
        // },
      },
      defaults: {
        from: environment.mail.fromSection,
      },
      template: {
        dir: join(__dirname, 'assets/mail'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailConsumer, TokenGenerationService, Match],
  exports: [
    TypeOrmModule,
    CacheModule,
    BullModule,
    ScheduleModule,
    EventEmitterModule,
    GraphQLModule,
    MailerModule,
    EmailConsumer,
    TokenGenerationService,
    Match,
  ],
})
export class GlobalModule {}
