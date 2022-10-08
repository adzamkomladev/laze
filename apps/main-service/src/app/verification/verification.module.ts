import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { UserVerification } from './entities/user-verification.entity';

import { VerificationService } from './verification.service';

import { VerificationResolver } from './verification.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserVerification]), UsersModule],
  providers: [VerificationResolver, VerificationService],
  exports: [TypeOrmModule],
})
export class VerificationModule {}
