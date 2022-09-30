import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  providers: [UsersResolver, UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
