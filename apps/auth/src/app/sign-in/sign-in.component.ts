import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  TuiInputModule,
  TuiInputPasswordModule,
  TuiIslandModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { SignInForm } from './interfaces/sign-in-form.interface';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiInputModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiInputPasswordModule,
    TuiButtonModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  form!: FormGroup<SignInForm>;

  constructor(private readonly fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.email],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          ),
        ],
      ],
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
