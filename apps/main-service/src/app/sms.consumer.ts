import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { Job } from 'bull';

@Processor('sms')
export class SmsConsumer {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(SmsConsumer.name);
  }

  @Process()
  async sendSms(job: Job<{ message: string; repeat: number }>) {
    let progress = 0;
    for (let i = 0; i < 100; i += 5) {
      progress += 5;
      await job.progress(progress);
    }

    this.logger.log('sendSms processed', job.data);

    return { ...job.data };
  }
}
