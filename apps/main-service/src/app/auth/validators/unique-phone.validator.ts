import { Injectable } from '@nestjs/common';

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersService } from '../../users/users.service';

@ValidatorConstraint({ name: 'UniquePhone', async: true })
@Injectable()
export class UniquePhone implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(phone: string) {
    try {
      return !(await this.userService.findUserByPhone(phone));
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `phone already exists`;
  }
}
