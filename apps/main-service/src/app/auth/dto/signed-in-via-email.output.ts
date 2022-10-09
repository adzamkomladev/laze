import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../../users/entities/user.entity';

import { AuthOutput } from './auth.output';

@ObjectType()
export class SignedInViaEmailOutput {
  @Field(() => User, { description: 'User signed in' })
  public user: User;

  @Field(() => AuthOutput, { description: 'Auth options' })
  public auth: AuthOutput;
}
