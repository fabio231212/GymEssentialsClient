import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/share/user.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { EvaluacionUsuarioComponent } from '../evaluacion-usuario/evaluacion-usuario.component';

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
  displayedColumns = ['comprador', 'fechaCompra', 'producto', 'estado', 'cantidad', 'subtotal', 'acciones'];
  isAutenticated: boolean;
  currentUser: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe,
    private authService: UserService,
    private noti: NotificacionService,
    public dialog: MatDialog
  ) {
    let id = this.route.snapshot.paramMap.get('idVendedor');
    if (!isNaN(Number(id))) {
      this.listaProdFactVendedor(Number(id));
    }
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al boolean que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
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
        console.log(this.dataSource);
      });
  }

  openEvDialog(id: number) {

    const dialogRef = this.dialog.open(EvaluacionUsuarioComponent, {
      width: '2000px',
      data: { id: id, isVendedor: false },
    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  async actualizarEstado(id: any) {
    const datos = {
      id: id,
      estado: 3
    };

    this.gService
      .update('facturas/actualizarEstado', datos)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.listaProdFactVendedor(this.currentUser.userId);
      });
    this.noti.mensaje(
      '',
      'El estado del detalle de la factura ha sido actualizado',
      TipoMessage.success
    );
  }

  filtrarPendientes() {
    // Filtra los datos y asigna solo aquellos con estadoId igual a 1
    const datosFiltrados = this.datos.filter(item => item.estadoId === 1);
    // Asigna los datos filtrados a dataSource
    this.dataSource.data = datosFiltrados;
  }

  filtrarEntregados() {
    // Filtra los datos y asigna solo aquellos con estadoId igual a 1
    const datosFiltrados = this.datos.filter(item => item.estadoId === 3);
    // Asigna los datos filtrados a dataSource
    this.dataSource.data = datosFiltrados;
  }

  sinFiltro() {
    // Asigna los datos sin filtrar a dataSource
    this.dataSource.data = this.datos;
  }

  detalle(id: number) {
    this.router.navigate(['/vendedor/facturas/facturaDetalle/', id], {
      relativeTo: this.route,
    });
  }
}
