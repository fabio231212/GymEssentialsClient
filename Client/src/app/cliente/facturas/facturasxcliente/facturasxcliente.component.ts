import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-facturasxcliente',
  templateUrl: './facturasxcliente.component.html',
  styleUrls: ['./facturasxcliente.component.scss'],
})
export class FacturasxclienteComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'fechaCompra', 'total', 'metodoPago', 'estado', 'acciones'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe
  ) {
    let id = this.route.snapshot.paramMap.get('idUsuario');
    if (!isNaN(Number(id))) {
      this.listaFacturasxUsuario(Number(id));
    }
  }

  listaFacturasxUsuario(idVendedor: any) {
    this.gService
      .list('facturas/idUsuario/' + idVendedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.datos = data;
        this.datos.forEach((item: any) => {
          item.fechaCompra = this.datePipe.transform(
            item.fechaCompra,
            'dd/MM/yyyy'
          );
          const ultimosDigitos = item.metodoPago.numTarjeta.slice(-4);
          // Dar formato al número de tarjeta con los últimos 4 dígitos visibles y el resto oculto
          item.metodoPago.numTarjeta = `XXX-XXX-XXX-${ultimosDigitos}`;
        });

        console.log(this.datos);

        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  detalle(id: number) {
    this.router.navigate(['/cliente/facturas/facturaDetalle/', id], {
      relativeTo: this.route,
    });
  }
}
