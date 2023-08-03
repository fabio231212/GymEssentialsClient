import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoXVendedorComponent } from './Admin/producto-xvendedor/producto-xvendedor.component';
import { ProductsAllComponent } from './products-all/products-all.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AuthGuard } from '../share/auth.guard';
import { ProductosFormComponent } from './productos-form/productos-form.component';

const routes: Routes = [
  {
    path: 'productos',
    component: ProductsAllComponent,
    canActivate: [AuthGuard],
    data: {roles: ['Administrador','Vendedor','Comprador'], breadcrumb: 'Lista de Producto' },
  },
  {
    path: 'productos/productodetalle/:idProducto',
    component: ProductDetailComponent,
  },
  {
    path: 'productos',
    component: ProductsAllComponent,
    data: { breadcrumb: 'Lista de productos' },
  },
  {
    path: 'productos/productoxvendedor/:idVendedor',
    component: ProductoXVendedorComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'Lista de productos' },
  },
  {
    path: 'productos/crear',
    component: ProductosFormComponent,
    // canActivate: [AuthGuard],
    data: {breadcrumb: 'Crear Productos' },
  },
  {
    path: 'productos/editar/:id',
    component: ProductosFormComponent,
    // canActivate: [AuthGuard],
    data: {breadcrumb: 'Lista de productos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosRoutingModule {}
