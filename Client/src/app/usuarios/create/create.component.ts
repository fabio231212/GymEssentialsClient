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
import { get } from 'http';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  registerForm: FormGroup;
  hide = true;
  hide2 = true;
  usuario: any;
  listRoles: any;
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
    private userService: UserService
  ) {
    this.crearFormularioLogin();
    this.getRoles();
  }

  public crearFormularioLogin() {
    this.registerForm = this.formBuilder.group({
      // email: ['', Validators.compose([Validators.required, emailValidator])],
      email: ['', Validators.compose([Validators.required])],
      clave: ['', Validators.required],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      numCelular: ['', Validators.required],
      roles : [null, Validators.required],
    });
  }

  getRoles() {
    this.gService
      .list('roles')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.listRoles = data;
        console.log( this.listRoles);
      });
  }

  onRegisterFormSubmit() {
    this.makeSubmit=true;
    //Validación
    if(this.registerForm.invalid){
     return;
    }
    console.log(this.registerForm.value);
    if(this.registerForm.get('roles').value === 0){
    let  rFormat=[{id:2},{id:3}]
    this.registerForm.patchValue({roles: rFormat});
    }
    this.userService.createUser(this.registerForm.value)
    .subscribe((respuesta:any)=>{
      this.usuario=respuesta;
      this.router.navigate(['/usuario/login'],{
        //Mostrar un mensaje
        queryParams:{register:'true'},
      })
    })
  }
  onReset() {
    this.registerForm.reset();
  }
  public errorHandling = (control: string, error: string) => {
    return (
      this.registerForm.controls[control].hasError(error) &&
      this.registerForm.controls[control].invalid &&
      (this.makeSubmit || this.registerForm.controls[control].touched)
    );
  };

}
