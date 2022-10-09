import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { SignUpViaEmailInput } from '../dto/sign-up-via-email.input';
import { SignInViaEmailInput } from '../dto/sign-in-via-email.input';
import { SignedUpViaEmailOutput } from '../dto/signed-up-via-email.output';
import { SignedInViaEmailOutput } from '../dto/signed-in-via-email.output';

import { AuthService } from '../auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignedUpViaEmailOutput, { name: 'signUpViaEmail' })
  signUpViaEmail(
    @Args('signUpViaEmailInput') signUpViaEmailInput: SignUpViaEmailInput
  ) {
    return this.authService.signUpViaEmail(signUpViaEmailInput);
  }

  @Mutation(() => SignedInViaEmailOutput, { name: 'signInViaEmail' })
  signInViaEmail(
    @Args('signInViaEmailInput') signInViaEmailInput: SignInViaEmailInput
  ) {
    return this.authService.signInViaEmail(signInViaEmailInput);
  }
}
