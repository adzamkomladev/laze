import { FormControl } from '@angular/forms';

export interface SignInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}
