import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductosRoutingModule } from './productos-routing.module';
import { ShareModule } from '../share/share.module';
import { ProductoXVendedorComponent } from './Admin/producto-xvendedor/producto-xvendedor.component';


@NgModule({
  declarations: [
    ProductoXVendedorComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    NgxPaginationModule,
    ShareModule
  ]
})
export class ProductosModule { }
