import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { DataSource, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Profile } from '../users/entities/profile.entity';
import { UserVerification } from '../verification/entities/user-verification.entity';

import { SignUpViaEmailInput } from './dto/sign-up-via-email.input';
import { SignedUpViaEmailOutput } from './dto/signed-up-via-email.output';

import { JwtPayload } from './interfaces/jwt-payload.interface';

import { Events } from './enums/events.enum';

import { UserSignedUpEvent } from './events/user-signed-up.event';

@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>
  ) {}

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

      throw new BadRequestException('Failed to sign up via email');
    } finally {
      await queryRunner.release();
    }
  }

  async findUserById(id: string) {
    try {
      return await this.userRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
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
    } catch (error) {
      throw new NotFoundException('User not found!');
    }
  }

  async validateJwt(jwt: string) {
    try {
      const payload = this.jwtService.decode(jwt) as JwtPayload;

      return await this.findUserById(payload.id);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async generateJwtToken(user: User) {
    const payload: JwtPayload = { id: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }
}
