import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';

import { Queue } from 'bull';

import { Cache } from 'cache-manager';

import { RerouteEmailEvent } from './reroute-email.event';

@Injectable()
export class EmailReroutedListener {
  private readonly logger: Logger;

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectQueue('email') private emailQueue: Queue
  ) {
    this.logger = new Logger(EmailReroutedListener.name);
  }

  @OnEvent('reroute.email')
  async handleRerouteEmailEvent(event: RerouteEmailEvent) {
    await this.emailQueue.add({ ...event });

    const responses = ['Welcome here', 'Akwaba', 'Woezor'];
    const message = responses[Math.floor(Math.random() * responses.length)];

    await this.cache.set('message', message, { ttl: 60 });

    this.logger.debug('Called listener with: ', { ...event });
  }
}
