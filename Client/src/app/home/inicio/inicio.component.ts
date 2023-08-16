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
    { title: 'Viva la Testosterona', subtitle: 'Special for today', image: 'assets/images/carousel/banner1.jpg' },
    { title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner2.jpg' },
    { title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner3.jpg' },
    { title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner4.jpg' },
    { title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner5.jpg' }
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


  constructor(public appService:AppService, private gService: GenericService, private noti: NotificacionService,public router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.getBanners();
    this.getBrands();
    this.getProducts('nuevos');
    this.mensajes();
  }

  public onLinkClick(e){
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

  public getBanners(){
    this.appService.getBanners().subscribe(data=>{
      this.banners = data;
    })
  }

  public getBrands(){
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
