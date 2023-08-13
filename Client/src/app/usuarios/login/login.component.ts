import { MatSnackBar } from '@angular/material/snack-bar';
import {
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
import { UserChatService } from 'src/app/share/chat.Service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  makeSubmit: boolean = false;
  infoUsuario: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  datos: any;

  constructor(
    private gService: GenericService,
    private noti: NotificacionService,
    public formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private userService: UserService, private chatService: UserChatService
  ) {
    this.crearFormularioLogin();
  }

  public crearFormularioLogin() {
    this.loginForm = this.formBuilder.group({
      // email: ['', Validators.compose([Validators.required, emailValidator])],
      email: ['', Validators.compose([Validators.required])],
      clave: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.mensajes();
  }

  mensajes() {
    let register = false;
    let auth = '';
    //Obtener parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      register = params['register'] === 'true' || false;
      auth = params['auth'] || '';
      if (register) {
        this.noti.mensaje(
          'Advertencia',
          'Usuario no encontrado. Por favor, verifica tus credenciales.',
          TipoMessage.warning
        );
      }
      if (auth) {
        this.noti.mensaje('Usuario', 'Acceso denegado', TipoMessage.warning);
      }
    });
  }

  onReset() {
    this.loginForm.reset();
  }

  public onLoginFormSubmit(): void {
    this.makeSubmit = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.userService
      .loginUser(this.loginForm.value)
      .subscribe((respuesta: any) => {
        let user = this.userService.currentUserValue;

        if (user.roles.includes('Administrador') && !user.roles.includes('Vendedor')) {
          this.router.navigate(['/admin']);
        } else {
          if (user.roles.includes('Vendedor')) {
            //   this.chatService.initializeSocket();

          }
          this.router.navigate(['/']);
        }

      });
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.loginForm.controls[control].hasError(error) &&
      this.loginForm.controls[control].invalid &&
      (this.makeSubmit || this.loginForm.controls[control].touched)
    );
  };
}
