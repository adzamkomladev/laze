import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Verification {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
