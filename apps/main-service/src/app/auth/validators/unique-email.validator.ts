import { Injectable } from '@nestjs/common';

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersService } from '../../users/users.service';

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class UniqueEmail implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(email: string) {
    try {
      return !(await this.userService.findUserByEmail(email));
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `email already exists`;
  }
}
