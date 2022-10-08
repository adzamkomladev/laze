import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Profile } from '../../users/entities/profile.entity';
import { User } from '../../users/entities/user.entity';

import { ProfileService } from '../services/profile.service';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @ResolveField('profile', () => Profile)
  profile(@Parent() user: User) {
    return this.profileService.findProfileById(user.profileId);
  }
}
