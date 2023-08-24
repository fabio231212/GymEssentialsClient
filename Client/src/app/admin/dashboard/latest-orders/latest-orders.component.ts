import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-latest-orders',
  templateUrl: './latest-orders.component.html',
  styleUrls: ['./latest-orders.component.scss']
})
export class LatestOrdersComponent implements OnInit {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isAutenticated: boolean;
  currentUser: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe, private userService: UserService) { 
      this.userService.currentUser.subscribe((x) => (this.currentUser = x));
      //Subscripción al boolean que indica si esta autenticado
      this.userService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
    }

  ngOnInit(): void {
    this.userService.currentUser.subscribe((data: any) => {
      this.listaProdFactVendedor(data.userId);
    })

  }
  listaProdFactVendedor(idVendedor: any) {
    this.gService
      .list('facturas/idVendedor/' + idVendedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.datos = data;
        this.datos.forEach((item: any) => {
          item.encabezadosFactura.fechaCompra = this.datePipe.transform(
            item.encabezadosFactura.fechaCompra,
            'dd/MM/yyyy'
          );
        });


      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  detalle(id: number) {
    this.router.navigate(['/vendedor/facturas/facturaDetalle/', id], {
      relativeTo: this.route,
    });
  }

}
