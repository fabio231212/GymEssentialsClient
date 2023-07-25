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
import {
  NotificacionService,
  TipoMessage,
} from 'src/app/share/notification.service';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  datos: any;

  constructor(
    private gService: GenericService,
    private noti: NotificacionService,
    public formBuilder: FormBuilder,
    public router: Router,
    public snackBar: MatSnackBar,
    private userService: UserService
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

  public onLoginFormSubmit(values: any): void {
    let data = this.loginForm.value;
    this.gService
      .create('usuarios/login/', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          console.log(data);
          this.datos = data;
          if (this.datos && this.datos.token) {
            // Autenticación exitosa, guardar el token en el LocalStorage
            localStorage.setItem('token', this.datos.token);
            this.userService = new UserService();
            // Redireccionar al usuario después del inicio de sesión
            this.router.navigate(['/']);
          } else {
            // Autenticación fallida, usuario no encontrado
            this.noti.mensaje(
              'Advertencia',
              'Usuario no encontrado. Por favor, verifica tus credenciales.',
              TipoMessage.warning
            );
          }
        },
        (error: any) => {
          if (error.status === 500) {
            // Error en el servidor
            this.noti.mensaje(
              'Error',
              'Error en el servidor. Por favor, inténtalo de nuevo más tarde.',
              TipoMessage.error
            );
          } else {
            // Otro código de error, mostrar mensaje genérico
            this.noti.mensaje(
              'Advertencia',
              'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.',
              TipoMessage.warning
            );
          }
        }
      );
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
