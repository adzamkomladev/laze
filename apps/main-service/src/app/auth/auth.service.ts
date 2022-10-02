import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignUpViaEmailInput } from './dto/sign-up-via-email.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserSignedUpEvent } from './events/user-signed-up.event';
import { Events } from './enums/events.enum';
import { Profile } from '../users/entities/profile.entity';
import { SignedUpViaEmailOutput } from './dto/signed-up-via-email.output';

@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) {}

  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async signUpViaEmail(signUpViaEmailInput: SignUpViaEmailInput) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { email, phone, password, name } = signUpViaEmailInput;

      let profile = this.profileRepository.create({ name });
      profile = await queryRunner.manager.save(profile);

      let user = this.userRepository.create({
        email,
        phone,
        password,
        profile,
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
      throw new UnauthorizedException();
    }
  }

  async validateJwt(jwt: string) {
    try {
      const payload = this.jwtService.decode(jwt) as JwtPayload;

      return await this.findUserById(payload.userId);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async generateJwtToken(user: User) {
    const payload: JwtPayload = { userId: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }
}
