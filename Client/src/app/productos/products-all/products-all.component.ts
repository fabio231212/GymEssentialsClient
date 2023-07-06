import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperConfigInterface } from '../../core/swiper/swiper.module';
import { MatDialog } from '@angular/material/dialog';
//import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-products-all',
  templateUrl: './products-all.component.html',
  styleUrls: ['./products-all.component.scss'],
})
export class ProductsAllComponent implements AfterViewInit {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public config: SwiperConfigInterface = {};
  public settings: Settings;
  constructor(
    public appSettings: AppSettings,
    public dialog: MatDialog,
    private gService: GenericService
  ) {
    this.settings = this.appSettings.settings;
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
    this.listaProductos();
  }

  listaProductos() {
    //localhost:3000/videojuego
    this.gService
      .list('productos/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }
  // public openProductDialog(product) {
  //   let dialogRef = this.dialog.open(ProductDialogComponent, {
  //     data: product,
  //     panelClass: 'product-dialog',
  //     direction: this.settings.rtl ? 'rtl' : 'ltr',
  //   });
  //   dialogRef.afterClosed().subscribe((product) => {
  //     if (product) {
  //       this.router.navigate(['/products', product.id, product.name]);
  //     }
  //   });
  // }
}
