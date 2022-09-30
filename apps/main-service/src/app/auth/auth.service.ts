import {Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateAuthInput} from './dto/create-auth.input';
import {UpdateAuthInput} from './dto/update-auth.input';
import {SignUpViaEmailInput} from './dto/sign-up-via-email.input';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../users/entities/user.entity';
import {Repository} from 'typeorm';
import {JwtService} from '@nestjs/jwt';
import {JwtPayload} from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
  }

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
    try {
      const {email, phone, password} = signUpViaEmailInput;

      let user = this.userRepository.create({email, phone, password});

      user = await this.userRepository.save(user);
      const accessToken = await this.generateJwtToken(user);

      return {
        user,
        auth: {
          accessToken,
        },
      };
    } catch (e) {
      console.log(e.message)
      throw new UnauthorizedException('Failed to register');
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
    const payload: JwtPayload = {userId: user.id, email: user.email};

    return this.jwtService.sign(payload);
  }
}
