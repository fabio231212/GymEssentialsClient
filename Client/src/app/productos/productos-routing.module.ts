import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoXVendedorComponent } from './Admin/producto-xvendedor/producto-xvendedor.component';
import { ProductsAllComponent } from './products-all/products-all.component';

const routes: Routes = [
  { path: 'productos', component: ProductsAllComponent },
  {
    path: 'productoxvendedor/:idVendedor',
    component: ProductoXVendedorComponent,
    data: { breadcrumb: 'Lista de productos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosRoutingModule {}
