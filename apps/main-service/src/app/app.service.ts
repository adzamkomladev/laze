import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async getData() {
    let message = await this.cache.get('message');
    if (!message) {
      const responses = ['Welcome here', 'Akwaba', 'Woezor'];
      message = responses[Math.floor(Math.random() * responses.length)];

      await this.cache.set('message', message, { ttl: 30000 });
    }
    return { message };
  }
}
