import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdfactxvendedorComponent } from './facturas/prodfactxvendedor/prodfactxvendedor.component';
import { ProductosFormComponent } from './productos/productos-form/productos-form.component';
import { AuthGuard } from '../share/auth.guard';
import { ProductoXVendedorComponent } from './productos/producto-xvendedor/producto-xvendedor.component';
import { FacturaDetailComponent } from './facturas/factura-detail/factura-detail.component';

export const routes: Routes = [ 
  {
    path: 'facturas/:idVendedor',
    component: ProdfactxvendedorComponent,
    canActivate:[AuthGuard],
    data: { roles:['Vendedor'] ,breadcrumb: 'Pedidos' },
  },
  {
    path: 'productos/crear',
    component: ProductosFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [ 'Vendedor'], breadcrumb: 'Crear Producto' },
  },
  { path: 'productos/:idVendedor', component: ProductoXVendedorComponent, canActivate:[AuthGuard], data: {roles: ['Administrador', 'Vendedor'], breadcrumb: 'Tus Productos' } },
  {
    path: 'productos/editar/:id',
    component: ProductosFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Vendedor'], breadcrumb: 'Editar Producto' },
  },
  {
    path: 'facturas/facturaDetalle/:idFactura',
    component: FacturaDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: [ 'Vendedor'], breadcrumb: 'Facturas Detalle' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedorRoutingModule { }
