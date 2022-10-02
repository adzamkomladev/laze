import { registerEnumType } from '@nestjs/graphql';

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
}

registerEnumType(Sex, {
  name: 'Sex',
  description: 'Sex of user',
});
