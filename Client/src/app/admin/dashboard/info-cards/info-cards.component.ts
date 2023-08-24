import { orders, products, customers, refunds } from '../dashboard.data';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/share/user.service';
@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit {
  public worstSellers: any[];
  public top5Users: any[];
  public customers: any[];
  public evaluations: any[];
  public ventasPorMes: any[];
  public topCategories: any[];
  public countCategories: any[];
  datosTopSellers: any[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  public colorScheme: any = {
    domain: ['rgba(255,255,255,0.8)']
  };
  public autoScale = true;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  isAutenticated: boolean;
  currentUser: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe, private userService: UserService) { }

  ngOnInit() {
    this.customers = customers;
    this.getTop5();
    this.getWorstSellers();
    //Subscripción a la información del usuario actual
    this.userService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al boolean que indica si esta autenticado
    this.userService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
    this.getEvaluation();
    this.getVentasXMes(this.currentUser.userId);
    this.getCategoriasMasVendidasByVend(this.currentUser.userId);
    this.getCategoriasMasVendidas();

  }

  public onSelect(event) {
  }


  ngOnDestroy() {
  }
  getTop5() {
    this.gService
      .list('usuarios/top5/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {

        this.top5Users = [...data]; // Assign here if needed immediately
      });
  }
  getWorstSellers() {
    this.gService
      .list('usuarios/top3Worst/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.worstSellers = [...data]; // Assign here if needed immediately
      });
  }

  getEvaluation() {
    this.gService
      .get('usuarios/evaluacionesVendedor', this.currentUser.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.evaluations = [...data]; // Assign here if needed immediately
      });
  }

  getVentasXMes(idVendedor: any) {
    this.gService
      .get('facturas/getVentasPorMesByVendedor', idVendedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const datosTransformados = {
          name: 'Ventas',
          series: data.map(item => ({
            name: item.name,
            value: parseFloat(item.value) // Convierte el valor a un número si es necesario
          }))
        };
        this.ventasPorMes = [datosTransformados];
      });
  }

  getCategoriasMasVendidasByVend(idVendedor: any) {
    this.gService
      .get('productos/topCategoriesVendedor', idVendedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.topCategories = [...data]; // Assign here if needed immediately
      });
  }
  getCategoriasMasVendidas() {
    this.gService
      .list('productos/getCountCategories/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const datosTransformados = {
          name: 'Categoría',
          series: data.map(item => ({
            name: item.name,
            value: parseFloat(item.value) // Convierte el valor a un número si es necesario
          }))
        };
        this.countCategories = [datosTransformados];
      });


  }


  ngAfterViewChecked() {
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}
