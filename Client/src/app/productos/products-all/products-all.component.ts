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
  public requireStockQuantity: boolean = false;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private gService: GenericService) {}

  ngAfterViewInit() {
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
}
