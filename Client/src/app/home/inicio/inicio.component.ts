import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  public slides = [
    { title: 'Testosterona para la vida', subtitle: 'Descubre los beneficios', image: 'assets/images/carousel/ronniepolicia.jpg' },
    { title: 'Trembo... legal?', subtitle: '¡Aprovecha Ahora!', image: 'assets/images/carousel/arnold.jpg' },
    { title: 'Creatina con descuento', subtitle: '¡Compruébalo ahora!', image: 'assets/images/carousel/chris.jpg' },
    { title: 'Suplementación 100% legal', subtitle: 'Cómpralos antes de que se acaben', image: 'assets/images/carousel/legalizeTrembo.jpg' },
    { title: 'Los más vendidos', subtitle: 'Especial para hoy', image: 'assets/images/carousel/mike.jpg' }
  ];

  public brands = [];
  public banners = [];

  destroy$: Subject<boolean> = new Subject<boolean>();
  public relatedProducts: Array<any>;
  public newProducts: Array<any>;
  public discountProducts: Array<any>;
  public Products: Array<any>;
  idProducto: any = 1;
  // public featuredProducts: Array<Product>;
  // public onSaleProducts: Array<Product>;
  // public topRatedProducts: Array<Product>;
  // public newArrivalsProducts: Array<Product>;


  constructor(public appService: AppService, private gService: GenericService, private noti: NotificacionService, public router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.getBanners();
    this.getBrands();
    this.getProducts('nuevos');
    this.mensajes();
  }

  public onLinkClick(e) {
    this.getProducts(e.tab.textLabel.toLowerCase());
  }



  public getProducts(type) {
    // if (type == 'Mejores' && !this.relatedProducts) {
    //   this.getBestCaliffiedProducts();
    // }
    if (type == 'nuevos' && !this.newProducts) {
      this.getNewProducts();
    }
    // if (type == 'best' && !this.relatedProducts) {
    //   this.getBestCaliffiedProducts();
    // }
    if (type == 'descuentos' && !this.discountProducts) {
      this.getProductsWithDiscount();
    }
  }

  // public getRelatedProducts(idCategoria: any) {
  //   this.gService
  //     .list('productos/categoria/' + idCategoria)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data: any) => {
  //       this.relatedProducts = data;
  //     });
  // }

  public getNewProducts() {
    this.gService
      .list('productos/nuevo')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.newProducts = data;
        // this.relatedProducts = data;
      });
  }

  // public getBestCaliffiedProducts() {
  //   this.gService
  //     .list('productos/calificacion')
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data: any) => {
  //       this.relatedProducts = data;
  //     });
  // }

  public getProductsWithDiscount() {
    this.gService
      .list('productos/descuento')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.discountProducts = data;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getBanners() {
    this.appService.getBanners().subscribe(data => {
      this.banners = data;
    })
  }

  public getBrands() {
    this.brands = this.appService.getBrands();
  }

  mensajes() {
    let register = false;
    let auth = '';
    //Obtener parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      auth = params['auth'] || '';
      if (auth) {
        this.noti.mensaje('Usuario', 'Acceso denegado', TipoMessage.warning);

      }
    });
  }


}
