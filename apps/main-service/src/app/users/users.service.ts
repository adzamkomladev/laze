import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    this.logger = new Logger(UsersService.name);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new NotFoundException('Failed to find user by email address');
    }
  }

  async findUserByPhone(phone: string) {
    try {
      return await this.userRepository.findOne({
        where: {
          phone,
        },
      });
    } catch (error) {
      throw new NotFoundException('Failed to find user by phone number');
    }
  }
}
