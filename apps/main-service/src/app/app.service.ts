import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Interval } from '@nestjs/schedule';

import { Cache } from 'cache-manager';

import { Queue } from 'bull';

@Injectable()
export class AppService {
  private readonly logger: Logger;

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('sms') private smsQueue: Queue
  ) {
    this.logger = new Logger(AppService.name);
  }

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

  // @Interval('sendSms', 2000)
  async sendSms() {
    let message = (await this.cache.get('message')) ?? 'Good morning';

    const responses = [1, 20, 45, 83, 96, 10, 2, 67];
    const repeat = responses[Math.floor(Math.random() * responses.length)];

    for (let i = 0; i < repeat; i++) {
      await this.smsQueue.add(
        {
          message,
          repeat,
        },
        { delay: 1000 * i }
      );
    }

    this.logger.debug('sendSms called');
  }
}
