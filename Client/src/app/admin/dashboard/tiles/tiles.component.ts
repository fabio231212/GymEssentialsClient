import { orders, products, customers, refunds } from '../dashboard.data';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/share/user.service';
import { get } from 'http';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss'],
})
export class TilesComponent implements AfterViewInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  cantCompras: number;
  countCompradores: number;
  countVendedores: number;
  productosSinStock: any;
  productosConDescuento: any;
  productoMasVendido: any;
  isAutenticated: boolean;
  currentUser: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe,
    private userService: UserService
  ) {
    //Subscripción a la información del usuario actual
    this.userService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al boolean que indica si esta autenticado
    this.userService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

  ngAfterViewInit(): void {
    this.getCantCompras();
    this.getCountVendedores();
    this.getCountCompradores();
    this.getProductoMasVendido();
    this.getProductoSinStock();
    this.getProductoConDescuento();

  }

  getCantCompras() {
    this.gService
      .list('facturas/numVentasCurrentDay/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.cantCompras = data;
      });
  }
  getCountVendedores() {
    this.gService
      .list('usuarios/getCountVendedores/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.countVendedores = data;
      });
  }
  getCountCompradores() {
    this.gService
      .list('usuarios/getCountCompradores/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.countCompradores = data;
      });
  }
  getProductoMasVendido() {
    this.gService
      .get('productos/topProductVendedor', this.currentUser.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.productoMasVendido = data[0];
      });
  }
  getProductoSinStock() {
    this.gService
      .get('productos/sinStock', this.currentUser.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.productosSinStock = data;
        console.log(this.productosSinStock);
      });
  }

  getProductoConDescuento() {
    this.gService
      .get('productos/conDescuento', this.currentUser.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.productosConDescuento = data;
      });
  }
}
