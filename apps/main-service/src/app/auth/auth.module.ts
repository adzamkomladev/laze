import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { environment } from '../../environments/environment';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';

import { UserSignedUpListener } from './listeners/user-signed-up.listener';

import { UniqueEmail } from './validators/unique-email.validator';
import { UniquePhone } from './validators/unique-phone.validator';

import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    JwtModule.register({
      secret: environment.jwt.secret,
      signOptions: { expiresIn: environment.jwt.signOptions.expiresIn },
    }),
    UsersModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    UniqueEmail,
    UniquePhone,
    UserSignedUpListener,
  ],
})
export class AuthModule {}
