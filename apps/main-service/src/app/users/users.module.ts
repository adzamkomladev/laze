import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';

import { UsersService } from './users.service';
import { ProfileService } from '../profile/profile.service';

import { UsersResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  providers: [UsersResolver, UsersService, ProfileService],
  exports: [TypeOrmModule, UsersService, ProfileService],
})
export class UsersModule {}
