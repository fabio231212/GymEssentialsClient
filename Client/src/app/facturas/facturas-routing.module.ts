import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturasxclienteComponent } from './facturasxcliente/facturasxcliente.component';
import { FacturaDetailComponent } from './factura-detail/factura-detail.component';

const routes: Routes = [
  {
    path: 'facturas/:idFactura',
    component: FacturaDetailComponent,
    data: { breadcrumb: 'Detalle Factura' },
  },
  {
    path: 'facturas/facturasxusuario/:idUsuario',
    component: FacturasxclienteComponent,
    data: { breadcrumb: 'Listado de facturas' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturasRoutingModule {}
