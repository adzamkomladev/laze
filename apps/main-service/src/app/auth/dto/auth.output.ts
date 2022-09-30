import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthOutput {
  @Field(() => String, { description: 'JWT access token' })
  public accessToken: string;
}
