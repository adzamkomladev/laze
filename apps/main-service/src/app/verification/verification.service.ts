import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { UserVerification } from './entities/user-verification.entity';

import { VerifyEmailViaOtpInput } from './dto/verify-email-via-otp.input';

@Injectable()
export class VerificationService {
  private readonly logger: Logger;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    this.logger = new Logger(VerificationService.name);
  }

  async verifyEmailViaOtp(
    verifyEmailViaOtpInput: VerifyEmailViaOtpInput,
    user: User
  ) {
    const { code, type } = verifyEmailViaOtpInput;
    const key = `users.${user.id}.otp.${type}`;

    const otp = await this.cache.get<string>(key);

    if (otp !== code) {
      throw new BadRequestException('OTP Code is not valid!');
    }

    try {
      const fullUser = await this.userRepository.findOneOrFail({
        where: {
          id: user.id,
        },
        relations: ['profile', 'verification'],
      });

      let verification = fullUser.verification;
      verification.email = true;
      verification.emailVerifiedAt = new Date();
      verification = await this.userVerificationRepository.save(verification);

      fullUser.verification = verification;

      await this.cache.del(key);

      return fullUser;
    } catch (e) {
      this.logger.error(e.message, e);

      throw new BadRequestException('Failed to verify email via otp!');
    }
  }
}
