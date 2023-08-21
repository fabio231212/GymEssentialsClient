import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UntypedFormBuilder } from '@angular/forms';

import { filter, map, Subject, Subscription, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-factura-detail',
  templateUrl: './factura-detail.component.html',
  styleUrls: ['./factura-detail.component.scss'],
})
export class FacturaDetailComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isAutenticated: boolean;
  currentUser: any;
  promedioCalificacion: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public formBuilder: UntypedFormBuilder,
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: UserService,
  ) {
    let id = this.route.snapshot.paramMap.get('idFactura');
    if (!isNaN(Number(id))) {
      this.getFacturaById(Number(id));
    }
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al boolean que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
  }

  getFacturaById(idFactura: any) {
    //localhost:3000/videojuego
    this.gService
      .list('facturas/' + idFactura)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && data.detallesFactura) {
          data.detallesFactura = data.detallesFactura.filter((detalle: any) => {
            return detalle.producto.usuarioId === this.currentUser.userId;
          });
        }

        this.datos = data;
        this.getPromedioCalificacion(this.datos.usuario.id);
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  async getPromedioCalificacion(idUsuario: any) {
    try {
      const data = await this.gService.get('evaluacionUsuario/promedio', idUsuario).pipe(takeUntil(this.destroy$)).toPromise();
      this.promedioCalificacion = data[0].promedio;
    } catch (error) {
      console.error(error);
    }

  }
  volver() {
    this.router.navigate(
      ['/vendedor/facturas/', this.currentUser.userId],
    );
  }
}
