import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdfactxvendedorComponent } from './facturas/prodfactxvendedor/prodfactxvendedor.component';
import { ProductosFormComponent } from './productos/productos-form/productos-form.component';
import { AuthGuard } from '../share/auth.guard';
import { ProductoXVendedorComponent } from './productos/producto-xvendedor/producto-xvendedor.component';

export const routes: Routes = [ 
  {
    path: 'facturas',
    component: ProdfactxvendedorComponent,
    canActivate:[AuthGuard],
    data: { roles:['Vendedor'] ,breadcrumb: 'Facturas por Vendedor' },
  },
  {
    path: 'productos/crear',
    component: ProductosFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'Crear Producto' },
  },
  { path: 'productos/:idVendedor', component: ProductoXVendedorComponent, canActivate:[AuthGuard], data: {roles: ['Administrador', 'Vendedor'], breadcrumb: 'Tus Productos' } },
  {
    path: 'productos/editar/:id',
    component: ProductosFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'Editar Producto' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedorRoutingModule { }
