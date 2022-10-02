import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';

import { Email } from '../interfaces/jobs/email.interface';

@Processor('email')
export class EmailConsumer {
  private readonly logger: Logger;

  constructor(private readonly mailerService: MailerService) {
    this.logger = new Logger(EmailConsumer.name);
  }

  @Process()
  async sendEmail(job: Job<Email>) {
    const data = job.data;

    const res = await this.mailerService.sendMail({
      to: data.receiver,
      subject: data.subject,
      template: data.template,
      context: {
        ...data.data,
      },
    });

    this.logger.log('EMAIL SUCCESSFULLY SENT', res);

    return data;
  }
}
