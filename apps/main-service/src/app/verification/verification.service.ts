import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { UserVerification } from './entities/user-verification.entity';

import { VerifyEmailViaOtpInput } from './dto/verify-email-via-otp.input';
import { VerifyPhoneViaOtpInput } from './dto/verify-phone-via-otp.input';
import { PhoneVerificationService } from '@laze/nestjs-phone-verification';
import { SendOtpInput } from './dto/send-otp.input';
import { OtpType } from './enums/otp-type.enum';
import { environment } from '../../environments/environment';

@Injectable()
export class VerificationService {
  private readonly logger: Logger;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly phoneVerificationService: PhoneVerificationService,
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

  async verifyPhoneViaOtp(
    verifyPhoneViaOtpInput: VerifyPhoneViaOtpInput,
    user: User
  ) {
    const { code } = verifyPhoneViaOtpInput;

    const res = await this.phoneVerificationService.verifyCode({
      code,
      number: user.phone,
    });

    if (!res.success) {
      this.logger.error(res);
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
      verification.phone = true;
      verification.phoneVerifiedAt = new Date();
      verification = await this.userVerificationRepository.save(verification);

      fullUser.verification = verification;

      return fullUser;
    } catch (e) {
      this.logger.error(e.message, e);

      throw new BadRequestException('Failed to verify phone via otp!');
    }
  }

  async sendOtpForPhoneVerification(sendOtpInput: SendOtpInput, user: User) {
    const { type } = sendOtpInput;

    const res = await this.phoneVerificationService.sendCode({
      number: user.phone,
      medium: type === OtpType.SMS ? 'sms' : 'voice',
      message: `Your ${environment.app.name} phone number verification code is %otp_code%. Do not share this code with anyone. Visit your ${environment.app.name} account now to verify.`,
    });

    if (!res.success) {
      this.logger.error(res);
      throw new BadRequestException(
        'Failed to send OTP code. Please try again later!'
      );
    }

    return await this.userRepository.findOneOrFail({
      where: {
        id: user.id,
      },
      relations: ['profile', 'verification'],
    });
  }

  async findUserVerificationById(id: number) {
    try {
      return await this.userVerificationRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new NotFoundException('User Verification not found!');
    }
  }
}
