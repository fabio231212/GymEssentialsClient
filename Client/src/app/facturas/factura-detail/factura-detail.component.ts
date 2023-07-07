import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UntypedFormBuilder } from '@angular/forms';

import { filter, map, Subject, Subscription, takeUntil } from 'rxjs';
import { AppService } from '../../app.service';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-factura-detail',
  templateUrl: './factura-detail.component.html',
  styleUrls: ['./factura-detail.component.scss'],
})
export class FacturaDetailComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public appService: AppService,
    private activatedRoute: ActivatedRoute,
    public formBuilder: UntypedFormBuilder,
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    let id = this.route.snapshot.paramMap.get('idFactura');
    if (!isNaN(Number(id))) {
      this.getProductById(Number(id));
    }
  }

  getProductById(idFactura: any) {
    //localhost:3000/videojuego
    this.gService
      .list('facturas/' + idFactura)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
        const ultimosDigitos = this.datos.numTarjeta.slice(-4);
        // Dar formato al número de tarjeta con los últimos 4 dígitos visibles y el resto oculto
        this.datos.numTarjeta = `XXX-XXX-XXX-${ultimosDigitos}`;
        //this.image = this.datos.imagenes.URL;
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  volver() {
    this.router.navigate(
      ['/facturas/facturasxusuario/', this.datos.usuarioId],
      {
        relativeTo: this.route,
      }
    );
  }
}
