import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from '../users/entities/user.entity';

import { VerifyEmailViaOtpInput } from './dto/verify-email-via-otp.input';

import { CurrentUser } from '../@common/decorators/current-user.decorator';

import { GqlAuthGuard } from '../@common/guards/gql-auth.guard';

import { VerificationService } from './verification.service';

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
}
