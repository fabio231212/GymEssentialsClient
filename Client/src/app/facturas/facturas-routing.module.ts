import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturasxclienteComponent } from './facturasxcliente/facturasxcliente.component';
import { FacturaDetailComponent } from './factura-detail/factura-detail.component';
import { ProdfactxvendedorComponent } from './prodfactxvendedor/prodfactxvendedor.component';
import { AuthGuard } from '../share/auth.guard';

const routes: Routes = [
  {
    path: 'facturas/:idFactura',
    component: FacturaDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor', 'Comprador'], breadcrumb: 'Detalle Factura' },
  },
  {
    path: 'facturas/facturasxusuario/:idUsuario',
    component: FacturasxclienteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor', 'Comprador'], breadcrumb: 'Facturas por Usuario' },
  },
  {
    path: 'facturas/facturasxvendedor/:idVendedor',
    component: ProdfactxvendedorComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'Listado de Facturas por Vendedor' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturasRoutingModule { }
