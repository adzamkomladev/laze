import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedDataAccessPhoneVerificationModule } from '@laze/nestjs-phone-verification';

import { UsersModule } from '../users/users.module';

import { UserVerification } from './entities/user-verification.entity';

import { VerificationService } from './services/verification.service';
// import { ProfileService } from './services/profile.service';

import { VerificationResolver } from './resolvers/verification.resolver';
// import { ProfileResolver } from './resolvers/profile.resolver';

@Module({
  imports: [
    SharedDataAccessPhoneVerificationModule,
    TypeOrmModule.forFeature([UserVerification]),
    UsersModule,
  ],
  providers: [
    VerificationResolver,
    VerificationService,
    // ProfileResolver,
    // ProfileService,
  ],
  exports: [TypeOrmModule],
})
export class VerificationModule {}
