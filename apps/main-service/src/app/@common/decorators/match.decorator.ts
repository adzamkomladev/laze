import { registerDecorator, ValidationOptions } from 'class-validator';
import { ClassConstructor } from 'class-transformer';

import { Match as MatchValidator } from '../validators/match.validator';

export const Match = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => any,
  validationOptions?: ValidationOptions
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchValidator,
    });
  };
};
