import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-prodfactxvendedor',
  templateUrl: './prodfactxvendedor.component.html',
  styleUrls: ['./prodfactxvendedor.component.scss']
})
export class ProdfactxvendedorComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['comprador', 'fechaCompra', 'producto', 'cantidad', 'subtotal', 'acciones'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe
  ) {
    let id = this.route.snapshot.paramMap.get('idVendedor');
    if (!isNaN(Number(id))) {
      this.listaProdFactVendedor(Number(id));
    }
  }

  listaProdFactVendedor(idVendedor: any) {
    this.gService
      .list('facturas/idVendedor/' + idVendedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
        this.datos.forEach((item: any) => {
          item.encabezadosFactura.fechaCompra = this.datePipe.transform(
            item.encabezadosFactura.fechaCompra,
            'dd/MM/yyyy'
          );
        });

        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
