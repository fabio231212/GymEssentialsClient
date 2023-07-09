import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoXVendedorComponent } from './Admin/producto-xvendedor/producto-xvendedor.component';
import { ProductsAllComponent } from './products-all/products-all.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
<<<<<<< HEAD
  {
    path: 'productos',
    component: ProductsAllComponent,
    data: { breadcrumb: 'Lista de productos' },
  },
  {
    path: 'productos/productodetalle/:idProducto',
    component: ProductDetailComponent,
  },
=======
  { path: 'productos', component: ProductsAllComponent, data: { breadcrumb: 'Lista de productos' } },
  { path: 'productos/productodetalle/:idProducto', component: ProductDetailComponent },
>>>>>>> eb355145eaa39d7c3ae7e5d2c4902ce3e01765d0
  {
    path: 'productos/productoxvendedor/:idVendedor',
    component: ProductoXVendedorComponent,
    data: { breadcrumb: 'Lista de productos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosRoutingModule {}
