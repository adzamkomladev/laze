import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

import { Cache } from 'cache-manager';

import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectQueue('email') private emailQueue: Queue
  ) {}

  async getData() {
    let message = await this.cache.get('message');
    if (!message) {
      const responses = ['Welcome here', 'Akwaba', 'Woezor'];
      message = responses[Math.floor(Math.random() * responses.length)];

      await this.cache.set('message', message, { ttl: 30 });
    } else {
      await this.emailQueue.add({
        message,
      });
    }

    return { message };
  }
}
