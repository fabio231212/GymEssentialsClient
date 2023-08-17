import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { creditCardValidator, matchingPasswords } from 'src/app/share/utils/app-validators';
import { Router } from '@angular/router';
import { Subject, Subscription, filter, map, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import {
  NotificacionService,
  TipoMessage,
} from 'src/app/share/notification.service';
import { UserService } from 'src/app/share/user.service';
import { MatStepper } from '@angular/material/stepper';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { DateService } from 'src/app/share/date.service';
import { ProvinceService } from 'src/app/share/provinces.services';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  //Variables para el stepper
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';
  //Formularios
  registerForm: FormGroup;
  //Meses y años para la tarjeta
  years: number[] = [];
  months: any[] = [];
  //Variables para mostrar y enseñar contraseña
  hide = true;
  hide2 = true;
  usuario: any;
  //Lista de lo roles
  listRoles: any;
  makeSubmit: boolean = false;
  infoUsuario: any;
  //Variables para la imagen
  previsualizacion: any[] = [];
  imagen: any;
  errorImagen: boolean = false;
  mensajeErrorImagen: string = '';
  destroy$: Subject<boolean> = new Subject<boolean>();
  datos: any;
  watcher: Subscription;
  sanitizer: any;
  //Variable para saber si es vendedor o no
  esVendedor: boolean = false;
  rolesControl: FormControl;
  rolesSubscription: Subscription;
  //Variables para las provincias, cantones y distritos
  provincias: any[] = [];
  cantones: any;
  distritos: any;
  cantonSeleccionado: any;
  distritoSeleccionado: any;
  provinciaSeleccionada: any;
  //Errores
  errors: any;

  constructor(
    private gService: GenericService,

    public formBuilder: FormBuilder,
    public router: Router,
    public snackBar: MatSnackBar,
    private userService: UserService,
    public mediaObserver: MediaObserver,
    public dateService: DateService,
    public provinceService: ProvinceService
  ) {
    this.crearFormularioLogin();
    this.getRoles();
    this.watcher = mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        if (change.mqAlias == 'xs') {
          this.stepperOrientation = 'vertical';
        } else if (change.mqAlias == 'sm') {
          this.stepperOrientation = 'vertical';
        } else if (change.mqAlias == 'md') {
          this.stepperOrientation = 'horizontal';
        } else {
          this.stepperOrientation = 'horizontal';
        }
      });
  }
  ngOnInit(): void {
    this.months = this.dateService.getMonths();
    this.years = this.dateService.getYears();
    this.loadProvincias();
    this.onChangeRol();
  }

  public crearFormularioLogin() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]], // Formato de cédula costarricense (9 dígitos)
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      apellidos: ['', [Validators.required, Validators.minLength(10)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)]], // Mismo formato que la clave
      numCelular: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Número de celular costarricense (8 dígitos)
      roles: [null, Validators.required],
      fotoPerfil: [null, Validators.required],
      propietarioTarjeta: ['', null],
      numeroTarjeta: ['', null],
      mesVencimiento: ['', null],
      anioVencimiento: ['', null],
      cvv: ['', null],
      provincia: ['', null],
      canton: ['', null],
      distrito: ['', null],
      zip: ['', null],
      otrasSennas: ['', null],
    },{validator: matchingPasswords('clave', 'confirmPassword')});
  }

  //Metodo para obtener los roles
  getRoles() {
    this.gService
      .list('roles')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.listRoles = data;
      });
  }
  //Metodo para guardar el usuario
  onRegisterFormSubmit() {
    this.makeSubmit = true;

    // Validación
    if (this.registerForm.invalid) {
      return;
    }

    if (this.imagen.length <= 0 || this.imagen == null) {
      this.errorImagen = true;
      this.mensajeErrorImagen = 'Debe agregar al menos una imagen';
      return;
    } else if (this.imagen.length > 1) {
      this.errorImagen = true;
      this.mensajeErrorImagen = 'Solo se permite una imagen';
      return;
    }

    this.rolesSubscription.unsubscribe();

    if (!this.esVendedor) {
      this.deleteControls();
    }

    if (this.registerForm.get('roles').value === 0) {
      let rFormat = [{ id: 2 }, { id: 3 }];
      this.registerForm.patchValue({ roles: rFormat });
    } else {
      let rFormat = [{ id: this.registerForm.get('roles').value }];
      this.registerForm.patchValue({ roles: rFormat });
    }

    this.registerForm.removeControl('fotoPerfil');
    const formValue = this.registerForm.value;
    const formData = new FormData();

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];

      if (key === 'roles') {
        // Agregar matrices de objetos al FormData
        formData.append(key, JSON.stringify(value));
      } else {
        // Agregar todos los datos al FormData
        formData.set(key, value);
      }
    });

    // Agregar la imagen al FormData
    formData.append('fotoPerfil', this.imagen);

    this.userService
      .createUser(formData) // Pasa los valores del formulario
      .subscribe((respuesta: any) => {
        this.usuario = respuesta;
        this.router.navigate(['/login'], {
          // Mostrar un mensaje
          queryParams: { register: 'true' },
        });
      });
  }

  //Este metodo se encarga de obtener el rol del usuario y en caso de que sea vendedor se hace que los campos
  //de la tarjeta de credito sean obligatorios y que los campos de la direccion sean obligatorios
  //de lo contrario se hace que los campos de la tarjeta de credito y de la direccion no sean obligatorios
  onChangeRol() {
    this.rolesControl = this.registerForm.get('roles') as FormControl;

    this.rolesSubscription = this.rolesControl.valueChanges.subscribe(
      (newValue) => {
        if (newValue === 0 || newValue === 3) {
          this.esVendedor = true;
          this.registerForm
            .get('propietarioTarjeta')
            .setValidators([Validators.required,
              Validators.minLength(5)]);
          this.registerForm
            .get('numeroTarjeta')
            .setValidators([Validators.required,
              creditCardValidator]);
          this.registerForm
            .get('mesVencimiento')
            .setValidators([Validators.required]);
          this.registerForm
            .get('anioVencimiento')
            .setValidators([Validators.required]);
          this.registerForm.get('cvv').setValidators([Validators.required,
            Validators.pattern(/^\d{3}$/) ]);
          this.registerForm
            .get('provincia')
            .setValidators([Validators.required]);
          this.registerForm.get('canton').setValidators([Validators.required]);
          this.registerForm
            .get('distrito')
            .setValidators([Validators.required]);
          this.registerForm.get('zip').setValidators([Validators.required]);
          this.registerForm
            .get('otrasSennas')
            .setValidators([Validators.required,
              Validators.minLength(25)]);
        } else {
          this.esVendedor = false;
          this.registerForm.get('propietarioTarjeta').clearValidators();
          this.registerForm.get('propietarioTarjeta').setValue('');
          this.registerForm.get('numeroTarjeta').clearValidators();
          this.registerForm.get('numeroTarjeta').setValue('');
          this.registerForm.get('mesVencimiento').clearValidators();
          this.registerForm.get('mesVencimiento').setValue(null);
          this.registerForm.get('anioVencimiento').clearValidators();
          this.registerForm.get('anioVencimiento').setValue(null);
          this.registerForm.get('cvv').clearValidators();
          this.registerForm.get('cvv').setValue('');
          this.registerForm.get('provincia').clearValidators();
          this.registerForm.get('provincia').setValue(null);
          this.registerForm.get('canton').clearValidators();
          this.registerForm.get('canton').setValue(null);
          this.registerForm.get('distrito').clearValidators();
          this.registerForm.get('distrito').setValue(null);
          this.registerForm.get('zip').clearValidators();
          this.registerForm.get('zip').setValue('');
          this.registerForm.get('otrasSennas').clearValidators();
          this.registerForm.get('otrasSennas').setValue('');
        }
        this.registerForm.get('propietarioTarjeta').updateValueAndValidity();
        this.registerForm.get('numeroTarjeta').updateValueAndValidity();
        this.registerForm.get('mesVencimiento').updateValueAndValidity();
        this.registerForm.get('anioVencimiento').updateValueAndValidity();
        this.registerForm.get('cvv').updateValueAndValidity();
        this.registerForm.get('provincia').updateValueAndValidity();
        this.registerForm.get('canton').updateValueAndValidity();
        this.registerForm.get('distrito').updateValueAndValidity();
        this.registerForm.get('zip').updateValueAndValidity();
        this.registerForm.get('otrasSennas').updateValueAndValidity();
      }
    );
  }
  deleteControls() {
    this.registerForm.removeControl('propietarioTarjeta');
    this.registerForm.removeControl('numeroTarjeta');
    this.registerForm.removeControl('mesVencimiento');
    this.registerForm.removeControl('anioVencimiento');
    this.registerForm.removeControl('cvv');
    this.registerForm.removeControl('provincia');
    this.registerForm.removeControl('canton');
    this.registerForm.removeControl('distrito');
    this.registerForm.removeControl('zip');
    this.registerForm.removeControl('otrasSennas');
  }
  //Metodo para resetear el formulario
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

  //Metodos para la imagen
  onImageSelected(event: any): any {
    const imagenSeleccionada = event.target.files[0];

    this.previsualizacion = []; // Limpiamos la vista previa anterior
    this.previsualizarImagen(imagenSeleccionada);
    this.imagen = imagenSeleccionada;
  }
  previsualizarImagen(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previsualizacion.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
  deleteImage(): void {
    this.imagen = undefined;
    this.previsualizacion = [];
  }
  ngOnDestroy() {
    this.watcher.unsubscribe();
    this.rolesSubscription.unsubscribe();
  }

  async loadProvincias() {
    try {
      const data: any = await this.provinceService.getProvinces();
      for (const key in data) {
        this.provincias.push({ id: key, name: data[key] });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async onProvinceChange() {
      this.cantones = [];
      this.distritos = [];
      this.cantonSeleccionado = '';
      const selectedProvinceName = this.registerForm.get('provincia').value;
      const selectedProvince = this.provincias.find(provincia => provincia.name === selectedProvinceName);

      if (selectedProvince) {
        this.provinciaSeleccionada = selectedProvince;
        try {
          const data: any = await this.provinceService.getCantons(
           selectedProvince.id
          );
          for (const key in data) {
            this.cantones.push({ id: key, name: data[key] });
          }
        } catch (error) {

        }
      }
    }

  async onCantonChange() {
      this.distritos = [];
      const selectedProvinceName = this.registerForm.get('provincia').value;
      const selectedProvince = this.provincias.find(provincia => provincia.name === selectedProvinceName);
      const selectedCantonName = this.registerForm.get('canton').value;
      const selectedCanton = this.cantones.find(canton => canton.name === selectedCantonName);

      if (selectedCanton && selectedProvince) {
        this.cantonSeleccionado = selectedCanton;
        this.provinciaSeleccionada = selectedProvince;
        try {
          const data: any = await this.provinceService.getDistritos(
            selectedProvince.id,
            selectedCanton.id
          );
          for (const key in data) {
            this.distritos.push({ id: key, name: data[key] });
          }
        } catch (error) {

        }
      }
    }
}


