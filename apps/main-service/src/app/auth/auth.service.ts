import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { DataSource, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { UserVerification } from '../verification/entities/user-verification.entity';

import { SignUpViaEmailInput } from './dto/sign-up-via-email.input';
import { SignInViaEmailInput } from './dto/sign-in-via-email.input';
import { SignedUpViaEmailOutput } from './dto/signed-up-via-email.output';
import { SignedInViaEmailOutput } from './dto/signed-in-via-email.output';

import { JwtPayload } from './interfaces/jwt-payload.interface';

import { Events } from './enums/events.enum';

import { UserSignedUpEvent } from './events/user-signed-up.event';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async signUpViaEmail(signUpViaEmailInput: SignUpViaEmailInput) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { email, phone, password, name } = signUpViaEmailInput;

      let profile = this.profileRepository.create({ name });
      profile = await queryRunner.manager.save(profile);

      let verification = this.userVerificationRepository.create({});
      verification = await queryRunner.manager.save(verification);

      let user = this.userRepository.create({
        email,
        phone,
        password,
        profile,
        verification,
      });
      user = await queryRunner.manager.save(user);

      const accessToken = await this.generateJwtToken(user);

      const userSignedUpEvent = new UserSignedUpEvent();
      userSignedUpEvent.user = user;
      this.eventEmitter.emit(Events.USER_SIGNED_UP, userSignedUpEvent);

      await queryRunner.commitTransaction();

      return {
        user,
        auth: {
          accessToken,
        },
      } as SignedUpViaEmailOutput;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      this.logger.error(e.message, e);

      throw new BadRequestException('Failed to sign up via email');
    } finally {
      await queryRunner.release();
    }
  }

  async signInViaEmail(signInViaEmailInput: SignInViaEmailInput) {
    try {
      const { email, password } = signInViaEmailInput;

      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user || !(await user?.validatePassword(password))) {
        throw new UnauthorizedException('Invalid user credentials');
      }

      const accessToken = await this.generateJwtToken(user);

      return {
        user,
        auth: {
          accessToken,
        },
      } as SignedInViaEmailOutput;
    } catch (e) {
      this.logger.error(e.message, e);

      throw e instanceof UnauthorizedException
        ? e
        : new BadRequestException('Failed to sign in via email');
    }
  }

  async findUserById(id: string) {
    try {
      return await this.userRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      this.logger.error(e.message, e);

      throw new NotFoundException('User not found!');
    }
  }

  async findUserByPayload(payload: JwtPayload) {
    try {
      return await this.userRepository.findOneOrFail({
        where: {
          id: payload.id,
        },
      });
    } catch (e) {
      this.logger.error(e.message, e);

      throw new NotFoundException('User not found!');
    }
  }

  async validateJwt(jwt: string) {
    try {
      const payload = this.jwtService.decode(jwt) as JwtPayload;

      return await this.findUserById(payload.id);
    } catch (e) {
      this.logger.error(e.message, e);

      throw new UnauthorizedException();
    }
  }

  private async generateJwtToken(user: User) {
    const payload: JwtPayload = { id: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }
}
