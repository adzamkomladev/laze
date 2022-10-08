import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../@common/decorators/current-user.decorator';

import { GqlAuthGuard } from '../../@common/guards/gql-auth.guard';

import { User } from '../../users/entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { UserVerification } from '../../verification/entities/user-verification.entity';

import { ProfileService } from '../../profile/profile.service';
import { VerificationService } from '../../verification/verification.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class CurrentUserResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly verificationService: VerificationService
  ) {}

  @Query(() => User, { name: 'currentUser' })
  currentUser(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField('profile', () => Profile)
  profile(@Parent() user: User) {
    return this.profileService.findProfileById(user.profileId);
  }

  @ResolveField('verification', () => UserVerification)
  verification(@Parent() user: User) {
    return this.verificationService.findUserVerificationById(
      user.verificationId
    );
  }
}
