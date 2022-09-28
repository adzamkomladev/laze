import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { Job } from 'bull';

@Processor('email')
export class EmailConsumer {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(EmailConsumer.name);
  }

  @Process()
  async transcode(job: Job<{ message: string }>) {
    let progress = 0;
    for (let i = 0; i < 100; i += 5) {
      progress += 5;
      await job.progress(progress);
    }
    this.logger.log(job.data.message);

    return { message: job.data.message };
  }
}
