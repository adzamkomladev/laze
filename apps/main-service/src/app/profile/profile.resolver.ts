import { Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { Profile } from './entities/profile.entity';
import { User } from '../users/entities/user.entity';

import { ProfileService } from './profile.service';

@Resolver()
export class ProfileResolver {
  // constructor(private readonly profileService: ProfileService) {}
  //
  // @ResolveField('profile', () => Profile)
  // profile(@Parent() user: User) {
  //   return this.profileService.findProfileById(user.profileId);
  // }
}
