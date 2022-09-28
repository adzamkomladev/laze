import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Job } from 'bull';
import { Repository } from 'typeorm';

import { Notification } from './notification.entity';

@Processor('email')
export class EmailConsumer {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {
    this.logger = new Logger(EmailConsumer.name);
  }

  @Process()
  async sendEmail(job: Job<{ message: string }>) {
    let progress = 0;
    for (let i = 0; i < 100; i += 5) {
      progress += 5;
      await job.progress(progress);
    }

    const notification = this.notificationRepository.create({
      message: job.data.message,
    });
    await this.notificationRepository.save(notification);
    this.logger.log(job.data.message);

    return { message: job.data.message };
  }
}
