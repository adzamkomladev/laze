import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { environment } from '../../environments/environment';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';

import { UserSignedUpListener } from './listeners/user-signed-up.listener';

import { UniqueEmail } from './validators/unique-email.validator';
import { UniquePhone } from './validators/unique-phone.validator';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthResolver } from './resolvers/auth.resolver';
import { VerificationModule } from '../verification/verification.module';
import { ProfileModule } from '../profile/profile.module';
import { CurrentUserResolver } from './resolvers/current-user.resolver';

@Module({
  imports: [
    JwtModule.register({
      secret: environment.jwt.secret,
      signOptions: { expiresIn: environment.jwt.signOptions.expiresIn },
    }),
    UsersModule,
    VerificationModule,
    ProfileModule,
  ],
  providers: [
    JwtStrategy,
    AuthResolver,
    AuthService,
    UniqueEmail,
    UniquePhone,
    UserSignedUpListener,
    CurrentUserResolver,
  ],
})
export class AuthModule {}
