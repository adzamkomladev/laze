import { registerDecorator, ValidationOptions } from 'class-validator';

import { UniquePhone as UniquePhoneValidator } from '../validators/unique-phone.validator';

export function UniquePhone(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniquePhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniquePhoneValidator,
      async: true
    });
  };
}
