import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductoXVendedorComponent} from './Admin/producto-xvendedor/producto-xvendedor.component';

const routes: Routes = [
  {path:'productoxvendedor/:idVendedor', component: ProductoXVendedorComponent, data:{ breadcrumb:'Lista de productos' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
