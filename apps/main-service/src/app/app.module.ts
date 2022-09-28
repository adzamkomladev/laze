import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
