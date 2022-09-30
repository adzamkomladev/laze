import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../../users/entities/user.entity';

import { AuthOutput } from './auth.output';

@ObjectType()
export class SignedUpViaEmailOutput {
  @Field(() => User, { description: 'User registered' })
  public user: User;

  @Field(() => AuthOutput, { description: 'Auth options' })
  public auth: AuthOutput;
}
