import { MatSnackBar } from '@angular/material/snack-bar';
import {
  emailValidator,
  matchingPasswords,
} from '../../share/utils/app-validators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public snackBar: MatSnackBar
  ) {
    this.crearFormularioLogin();
  }

  public crearFormularioLogin() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
    });

    this.registerForm = this.formBuilder.group(
      {
        name: [
          '',
          Validators.compose([Validators.required, Validators.minLength(3)]),
        ],
        email: ['', Validators.compose([Validators.required, emailValidator])],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: matchingPasswords('password', 'confirmPassword') }
    );
  }

  public onLoginFormSubmit(values: Object): void {
    if (this.loginForm.valid) {
      this.router.navigate(['/']);
    }
  }

  public onRegisterFormSubmit(values: Object): void {
    if (this.registerForm.valid) {
      this.snackBar.open('You registered successfully!', '×', {
        panelClass: 'success',
        verticalPosition: 'top',
        duration: 3000,
      });
    }
  }

  public errorHandling = (control: string, error: string) => {
    return this.loginForm.controls[control].hasError(error);
  };
}
