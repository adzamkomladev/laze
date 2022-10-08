import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';

import { Cache } from 'cache-manager';
import { Queue } from 'bull';

import { environment } from '../../../environments/environment';

import { User } from '../../users/entities/user.entity';

import { Email } from '../../@common/interfaces/jobs/email.interface';

import { Events } from '../enums/events.enum';

import { TokenGenerationService } from '../../@common/services/token-generation.service';

import { UserSignedUpEvent } from '../events/user-signed-up.event';
import { OtpType } from '../../verification/enums/otp-type.enum';

@Injectable()
export class UserSignedUpListener {
  private readonly logger: Logger;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly tokenGenerationService: TokenGenerationService
  ) {
    this.logger = new Logger(UserSignedUpListener.name);
  }

  @OnEvent(Events.USER_SIGNED_UP, { async: true })
  async handleUserSignedUpEvent(event: UserSignedUpEvent) {
    await Promise.all([
      this.sendWelcomeEmail(event.user),
      this.sendEmailOtp(event.user),
    ]);

    this.logger.debug('Called listener with: ', { ...event });
  }

  private async sendWelcomeEmail(user: User) {
    const job: Email = {
      receiver: user.email,
      subject: `Welcome to ${environment.app.name}!`,
      template: './auth/welcome',
      data: {
        name: `${user.profile.name.first} ${user.profile.name.last}`,
      },
    };

    await this.emailQueue.add(job);
  }

  private async sendEmailOtp(user: User) {
    const otp = '' + this.tokenGenerationService.generateOtp(6);

    await this.cache.set(`users.${user.id}.otp.${OtpType.EMAIL}`, otp, {
      ttl: 600,
    });

    const job: Email = {
      receiver: user.email,
      subject: `${environment.app.name} Email Verification`,
      template: './auth/email-otp',
      data: {
        name: `${user.profile.name.first} ${user.profile.name.last}`,
        otp,
      },
    };

    await this.emailQueue.add(job);
  }
}
