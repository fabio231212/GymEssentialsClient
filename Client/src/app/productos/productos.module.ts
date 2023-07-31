import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductosRoutingModule } from './productos-routing.module';
import { ShareModule } from '../share/share.module';
import { ProductoXVendedorComponent } from './Admin/producto-xvendedor/producto-xvendedor.component';
import { ProductsAllComponent } from './products-all/products-all.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductosFormComponent } from './productos-form/productos-form.component';
import { ProductZoomComponent } from './product-detail/product-zoom/product-zoom.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductoXVendedorComponent,
    ProductsAllComponent,
    ProductDetailComponent,
    ProductZoomComponent,
    ProductosFormComponent,
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    NgxPaginationModule,
    ShareModule,
    ReactiveFormsModule,
  ], 

  
})
export class ProductosModule {

}
