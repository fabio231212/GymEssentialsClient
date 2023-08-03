import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as e from 'express';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.component.html',
  styleUrls: ['./productos-form.component.scss'],
})
export class ProductosFormComponent implements OnInit {
  public previsualizacion: any[] = [];
  public imagenes: any[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();
  //Titulo
  titleForm: string = 'Crear';
  //Lista de marcas
  marcasList: any;
  //Lista de tamaños
  tamannosList: any;
  //Lista de categorias
  categoriasList: any;
  //Lista de estados
  estadosList: any;
  //Producto a actualizar
  productoInfo: any;
  //Respuesta del API crear/modificar
  respProducto: any;
  //Sí es submit
  submitted = false;
  //Nombre del formulario
  productoForm: FormGroup;
  //id del Videojuego
  idProducto: number = 0;
  //Sí es crear
  isCreate: boolean = true;
  //mostrar descuento
  mostrarDescuento: boolean = false;
  //errores de las imagenes
  errorImagenes: boolean = false;
  mensajeErrorImagenes: string = '';
  isAutenticated: boolean;
  currentUser: any;

  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private authService: UserService
  ) {
    this.formularioReactive();
    this.listaMarcas();
    this.listaTamannos();
    this.listaCategorias();
    this.listaEstadosProductos();
  }
  ngOnInit(): void {

    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al boolean que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));


    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params: Params) => {
      this.idProducto = params['id'];
      if (this.idProducto != undefined) {
        this.isCreate = false;
        this.titleForm = 'Actualizar';
        //Obtener producto a actualizar del AP
        this.gService
          .get('productos/', this.idProducto)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.productoInfo = data;
            this.previsualizacion = data.imagenes.map(({ imgUrl }) => imgUrl);
            this.mostrarDescuento = (this.productoInfo.descuento > 0 ? true : false);

            const fetchImageAsBlob = async (imageUrl) => {
              const response = await fetch(imageUrl);
              const blobData = await response.blob();
              return blobData;
            };

            const convertImageUrlsToFiles = async () => {
              for (const imageUrl of this.previsualizacion) {
                try {
                  const blobData = await fetchImageAsBlob(imageUrl);
                  const file = new File([blobData], 'image.png', {
                    type: 'image/png',
                  });
                  this.imagenes.push(file);
                } catch (error) {
                  console.error(`Error al obtener la imagen: ${imageUrl}`);
                }
              }
            };

            convertImageUrlsToFiles();

            this.productoForm.get('descuento').valueChanges.subscribe(descuento => {
              const precioOriginal = this.productoForm.get('precio').value;
              if (descuento !== null && descuento >= 0 && descuento < 100) {
                const precioOferta = precioOriginal - (precioOriginal * descuento / 100);
                this.productoForm.get('precioOferta').setValue(precioOferta);
              } else {
                this.productoForm.get('precioOferta').setValue(null);
              }
            });


            //Establecer los valores en cada una de las entradas del formulario
            this.productoForm.setValue({
              id: this.productoInfo.id,
              nombre: this.productoInfo.nombre,
              descripcion: this.productoInfo.descripcion,
              stock: this.productoInfo.stock,
              descuento: this.productoInfo.descuento,
              precio: this.productoInfo.precio,
              precioOferta: this.productoInfo.precioOferta,
              estadoProductoId: this.productoInfo.estadoProductoId,
              categoriaProductoId: this.productoInfo.categoriaProductoId,
              marcas: this.productoInfo.marcas.map(({ id }) => id),
              tamannos: this.productoInfo.tamannos.map(({ id }) => id),
              aplicarDescuento: (this.productoInfo.descuento > 0 ? true : false),
            });
          });
      }
    });
  }
  //Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.productoForm = this.fb.group({
      id: [null, null],
      nombre: [
        null,
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      descripcion: [null, Validators.compose([Validators.required, Validators.minLength(50)])],
      stock: [null, Validators.required],
      descuento: [null],
      precio: [null, Validators.required],
      precioOferta: [null],
      estadoProductoId: [null, Validators.required],
      categoriaProductoId: [null, Validators.required],
      marcas: [null, [Validators.required]],
      tamannos: [null, Validators.required],
      // imagenes: [null, Validators.required],
      aplicarDescuento: [false],
    });
  }

  listaMarcas() {
    this.marcasList = null;
    this.gService
      .list('marcas')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.marcasList = data;
      });
  }

  listaTamannos() {
    this.tamannosList = null;
    this.gService
      .list('tamannos')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.tamannosList = data;
      });
  }

  listaCategorias() {
    this.categoriasList = null;
    this.gService
      .list('categorias')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.categoriasList = data;
      });
  }

  listaEstadosProductos() {
    this.estadosList = null;
    this.gService
      .list('estadoproducto')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.estadosList = data;
      });
  }

  public errorHandling = (control: string, error: string) => {
    return this.productoForm.controls[control].hasError(error);
  };

  crearProducto(): void {
    this.submitted = true;

    if (this.productoForm.invalid) {
      return;
    }

    if (this.imagenes.length <= 0 || this.imagenes == null) {
      this.errorImagenes = true;
      this.mensajeErrorImagenes = 'Debe agregar al menos una imagen';
      return;
    } else if (this.imagenes.length > 5) {
      this.errorImagenes = true;
      this.mensajeErrorImagenes = 'Solo se permiten 5 imágenes';
      return;
    }

    const formData = new FormData();
    const formValue = this.productoForm.value;

    // Asegurar que marcas y tamannos sean matrices de objetos
    formValue.marcas = formValue.marcas.map((id: number) => ({ id: id }));
    formValue.tamannos = formValue.tamannos.map((id: number) => ({ id: id }));

    // Agregar los datos al FormData
    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];

      if (key === 'marcas' || key === 'tamannos') {
        // Agregar matrices de objetos al FormData
        formData.append(key, JSON.stringify(value));
      } else {
        // Agregar otros valores al FormData
        formData.append(key, value);
      }
    });

    formData.append('usuarioId', this.currentUser.userId);
    for (let i = 0; i < this.imagenes.length; i++) {
      formData.append('imagenes', this.imagenes[i]);
    }

    // Accion API create enviando el FormData
    this.gService
      .create('productos', formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respProducto = data;
        this.router.navigate(['/productos'], {
          queryParams: { create: 'true' },
        });
      });
  }

  //Actualizar Videojuego
  actualizarProducto() {
    //Establecer submit verdadero
    this.submitted = true;
    //Verificar validación
    if (this.productoForm.invalid) {
      return;
    }

    if (this.imagenes.length <= 0 || this.imagenes == null) {
      this.errorImagenes = true;
      this.mensajeErrorImagenes = 'Debe agregar al menos una imagen';
      return;
    } else if (this.imagenes.length > 5) {
      this.errorImagenes = true;
      this.mensajeErrorImagenes = 'Solo se permiten 5 imágenes';
      return;
    }

    const formData = new FormData();
    const formValue = this.productoForm.value;

    // Asegurar que marcas y tamannos sean matrices de objetos
    formValue.marcas = formValue.marcas.map((id: number) => ({ id: id }));
    formValue.tamannos = formValue.tamannos.map((id: number) => ({ id: id }));

    // Agregar los datos al FormData
    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];

      if (key === 'marcas' || key === 'tamannos') {
        // Agregar matrices de objetos al FormData
        formData.append(key, JSON.stringify(value));
      } else {
        // Agregar otros valores al FormData
        formData.append(key, value);
      }
    });

    formData.append('usuarioId', this.currentUser.userId);

    for (let i = 0; i < this.imagenes.length; i++) {
      formData.append('imagenes', this.imagenes[i]);
    }

    console.log(formData.get('imagenes'));
    //Accion API create enviando toda la informacion del formulario
    this.gService
      .update('productos', formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        //Obtener respuesta
        this.respProducto = data;
        this.router.navigate(['/productos'], {
          queryParams: { update: 'true' },
        });
      });
  }
  onReset() {
    this.submitted = false;
    this.productoForm.reset();
  }
  onBack() {
    this.router.navigate(['/productos']);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }

  capturarImg(event): any {
    const imagenCapturada = event.target.files[0];
    this.extraerBase64(imagenCapturada).then((imagen: any) => {
      this.previsualizacion.push(imagen.base);
    });
    this.imagenes.push(imagenCapturada);
  }

  extraerBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            base: null,
          });
        };
      } catch (e) {
        return null;
      }
    });

  eliminarImagen(index: number): void {
    if (index >= 0 && index < this.previsualizacion.length) {
      this.previsualizacion.splice(index, 1); // Elimina la imagen de la lista de previsualización
      this.imagenes.splice(index, 1); // Elimina la imagen de la lista de imágenes capturadas
    }
  }

  toggleDescuento() {
    this.mostrarDescuento = !this.mostrarDescuento;
    if (!this.mostrarDescuento) {
      this.productoForm.get('descuento').clearValidators();
      this.productoForm.get('descuento').setValue(0);
      this.productoForm.get('precioOferta').clearValidators();
      this.productoForm.get('precioOferta').setValue(0);
    } else {
      this.productoForm.get('descuento').setValidators([Validators.required]);
      this.productoForm.get('precioOferta').setValidators([Validators.required]);
    }
    this.productoForm.get('descuento').updateValueAndValidity();
    this.productoForm.get('precioOferta').updateValueAndValidity();
  }
}
