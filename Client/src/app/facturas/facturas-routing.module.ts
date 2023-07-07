import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturasxclienteComponent } from './facturasxcliente/facturasxcliente.component';
import { FacturaDetailComponent } from './factura-detail/factura-detail.component';
import { ProdfactxvendedorComponent } from './prodfactxvendedor/prodfactxvendedor.component';

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
  {
    path: 'facturas/facturasxvendedor/:idVendedor',
    component: ProdfactxvendedorComponent,
    data: { breadcrumb: 'Listado de Productos por Vendedor' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturasRoutingModule {}
