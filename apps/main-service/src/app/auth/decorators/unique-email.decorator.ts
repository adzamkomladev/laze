import { registerDecorator, ValidationOptions } from 'class-validator';

import { UniqueEmail as UniqueEmailValidator } from '../validators/unique-email.validator';

export function UniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniqueEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueEmailValidator,
      async: true,
    });
  };
}
