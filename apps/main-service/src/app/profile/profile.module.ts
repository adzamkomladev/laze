import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Profile } from './entities/profile.entity';

import { ProfileService } from './profile.service';

// import { ProfileResolver } from './profile.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ ProfileService],
  exports: [TypeOrmModule, ProfileService],
})
export class ProfileModule {}
