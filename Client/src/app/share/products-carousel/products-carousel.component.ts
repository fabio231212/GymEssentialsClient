import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperConfigInterface } from '../../core/swiper/swiper.module';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { GenericService } from '../generic.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss'],
})
export class ProductsCarouselComponent implements OnInit {
  @Input('requireStockQuantity') requireStockQuantity: boolean = false;
  @Input('idProducto') idProducto: number;
  @Input('products') products: Array<any> = [];
  @Input('product') product: any;
  public config: SwiperConfigInterface = {};
  public settings: Settings;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public appSettings: AppSettings,
    public appService: AppService,
    public dialog: MatDialog,
    private router: Router,
    private gService: GenericService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {}

  getProductById(idProducto: any) {
    //localhost:3000/videojuego
    this.gService
      .get('productos/', idProducto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.product = data;
      });
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 1,
        },
        740: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 5,
        },
      },
    };
  }

  public openProductDialog(product) {
    let dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: 'product-dialog',
      direction: this.settings.rtl ? 'rtl' : 'ltr',
    });
    dialogRef.afterClosed().subscribe((product) => {
      if (product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
