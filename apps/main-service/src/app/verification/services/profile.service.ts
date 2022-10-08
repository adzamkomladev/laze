import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Profile } from '../../users/entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) {}

  async findProfileById(id: number) {
    try {
      return await this.profileRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new NotFoundException('Profile not found!');
    }
  }
}
