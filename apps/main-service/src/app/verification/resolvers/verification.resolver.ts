import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from '../../users/entities/user.entity';

import { VerifyEmailViaOtpInput } from '../dto/verify-email-via-otp.input';
import { VerifyPhoneViaOtpInput } from '../dto/verify-phone-via-otp.input';

import { CurrentUser } from '../../@common/decorators/current-user.decorator';

import { GqlAuthGuard } from '../../@common/guards/gql-auth.guard';

import { VerificationService } from '../services/verification.service';
import { SendOtpInput } from '../dto/send-otp.input';

@Resolver()
@UseGuards(GqlAuthGuard)
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => User, { name: 'verifyEmailViaOtp' })
  verifyEmailViaOtp(
    @CurrentUser() user: User,
    @Args('verifyEmailViaOtpInput')
    verifyEmailViaOtpInput: VerifyEmailViaOtpInput
  ) {
    return this.verificationService.verifyEmailViaOtp(
      verifyEmailViaOtpInput,
      user
    );
  }

  @Mutation(() => User, { name: 'verifyPhoneViaOtp' })
  verifyPhoneViaOtp(
    @CurrentUser() user: User,
    @Args('verifyPhoneViaOtpInput')
    verifyPhoneViaOtpInput: VerifyPhoneViaOtpInput
  ) {
    return this.verificationService.verifyPhoneViaOtp(
      verifyPhoneViaOtpInput,
      user
    );
  }

  @Mutation(() => User, { name: 'sendOtpForPhoneVerification' })
  sendOtpForPhoneVerification(
    @CurrentUser() user: User,
    @Args('sendOtpInput')
    sendOtpInput: SendOtpInput
  ) {
    return this.verificationService.sendOtpForPhoneVerification(
      sendOtpInput,
      user
    );
  }
}
