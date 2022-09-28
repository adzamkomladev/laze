import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Job } from 'bull';
import { RerouteEmailEvent } from './reroute-email.event';

@Processor('sms')
export class SmsConsumer {
  private readonly logger: Logger;

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.logger = new Logger(SmsConsumer.name);
  }

  @Process()
  async sendSms(job: Job<{ message: string; repeat: number }>) {
    if (job.data.repeat % 2 === 0) {
      const emailRerouted = new RerouteEmailEvent();
      emailRerouted.message = job.data.message;
      emailRerouted.repeat = job.data.repeat;

      this.eventEmitter.emit('reroute.email', emailRerouted);
    }

    this.logger.log('sendSms processed', job.data);

    return {
      ...job.data,
    };
  }
}
