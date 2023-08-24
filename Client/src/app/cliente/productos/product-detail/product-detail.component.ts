import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  SwiperConfigInterface,
  SwiperDirective,
} from '../../../core/swiper/swiper.module';
import { Data, AppService } from '../../../app.service';
import { Product } from '../../../app.models';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { GenericService } from 'src/app/share/generic.service';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { UserService } from 'src/app/share/user.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { Comentario, ComentarioService } from 'src/app/share/comentarios.service';
import { UserChatService } from 'src/app/share/chat.Service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};

  public image: any;
  public zoomImage: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public form: FormGroup;
  public relatedProducts: Array<any>;
  public idProducto: number;
  calificacionSeleccionada: number = 0;
  comentarios: Comentario[] = [];
  user: any;
  promedioCalificacion: any;

  constructor(
    public appService: AppService,
    private userService: UserService,
    private notiService: NotificacionService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    private gService: GenericService,
    private route: ActivatedRoute,
    private chatService: UserChatService

  ) {
    let id = this.route.snapshot.paramMap.get('idProducto');
    if (!isNaN(Number(id))) {
      this.getProductById((Number(id))).then(() => {
        if (this.idProducto) {
          this.getRelatedProducts(this.datos.categoriaProductoId);
        }
      });
      this.idProducto = Number(id);
      this.reactiveForm();
    }


  }
  reactiveForm() {
    this.form = this.formBuilder.group({
      review: [null, [Validators.required, Validators.minLength(10)]],
      anonimo: [false],
    });

  }

  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  };


  ngOnInit() {

    this.userService.currentUser.subscribe((data) => {
      this.user = data;
    });
  }

  sendReview() {

    if (this.form.invalid) {
      return;
    }
    if (this.calificacionSeleccionada == 0) {
      this.notiService.mensaje('Comentario', 'Seleccione una calificación', TipoMessage.warning);
      return;
    }
    const data = {
      comentario: this.form.value.review,
      calificacion: this.calificacionSeleccionada,
      productoId: this.idProducto,
      usuarioId: this.form.get('anonimo').value ? null : this.userService.currentUserValue.userId,
      fecha: new Date()
    }
    this.gService.create('comentario', data)
      .pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
        if (resp) {
          this.getComentarios(this.idProducto);
          this.form.reset();
          this.calificacionSeleccionada = 0;
          this.notiService.mensaje('Comentario', 'Comentario enviado con éxito', TipoMessage.success);
        }
      });

  }


  onReset() {
    this.form.reset();
  }


  ngAfterViewInit() {
    this.config = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 10,
      keyboard: true,
      navigation: true,
      pagination: false,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 2,
        },
        600: {
          slidesPerView: 3,
        },
      },
    };
    // this.getRelatedProducts(this.datos.categoriaProductoId);
  }


  async getProductById(idProducto: any) {
    try {
      const data = await this.gService.get('productos/', idProducto).pipe(takeUntil(this.destroy$)).toPromise();
      this.datos = data;

      this.comentarios = this.datos.comentariosProducto;
      this.image = this.datos.imagenes[0].imgUrl;
      this.getPromedioCalificacion(this.datos.usuarioId);


    } catch (error) {
      console.error(error);
    }

  }

  async getComentarios(idProducto: any) {
    try {
      const data = await this.gService.get('productos/', idProducto).pipe(takeUntil(this.destroy$)).toPromise();
      this.comentarios = data.comentariosProducto;
    } catch (error) {
      console.error(error);
    }

  }

  async getPromedioCalificacion(idUsuario: any) {
    try {
      const data = await this.gService.get('evaluacionUsuario/promedio', idUsuario).pipe(takeUntil(this.destroy$)).toPromise();
      this.promedioCalificacion = data[0].promedio;
    } catch (error) {
      console.error(error);
    }

  }


  public getRelatedProducts(idCategoria: any) {
    this.gService
      .list('productos/categoria/' + idCategoria)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.relatedProducts = data;
      });
  }

  public selectImage(image) {
    this.image = image.imgUrl;
    this.zoomImage = image.imgUrl;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  getStars(cantidad: number): number[] {
    return Array.from({ length: cantidad });
  }

  seleccionarCalificacion(calificacion: number) {
    this.calificacionSeleccionada = calificacion;
  }
}
