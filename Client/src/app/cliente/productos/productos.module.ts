import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareModule } from '../../share/share.module'

import { ProductsAllComponent } from './products-all/products-all.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

import { ProductZoomComponent } from './product-detail/product-zoom/product-zoom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductsAllComponent,
    ProductZoomComponent,

  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ShareModule,
    ReactiveFormsModule,
  ],
})
export class ProductosModule { }
