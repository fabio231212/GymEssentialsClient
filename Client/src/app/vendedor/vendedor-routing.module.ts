import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdfactxvendedorComponent } from './facturas/prodfactxvendedor/prodfactxvendedor.component';
import { ProductosFormComponent } from './productos/productos-form/productos-form.component';
import { AuthGuard } from '../share/auth.guard';
import { ProductoXVendedorComponent } from './productos/producto-xvendedor/producto-xvendedor.component';

const routes: Routes = [
  {
    path: 'facturas',
    component: ProdfactxvendedorComponent,
    data: { breadcrumb: 'Lista de Producto' },
  },
  {
    path: 'productos/productoxvendedor/:idVendedor',
    component: ProductoXVendedorComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'Producto por Vendedor' },
  },
  {
    path: 'productos/crear',
    component: ProductosFormComponent,
    // canActivate: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'Crear Producto' },
  },
  {
    path: 'productos/editar/:id',
    component: ProductosFormComponent,
    // canActivate: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'Editar Producto' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedorRoutingModule { }
