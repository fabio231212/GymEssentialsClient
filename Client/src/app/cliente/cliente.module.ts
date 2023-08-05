import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ProductDetailComponent } from './productos/product-detail/product-detail.component';
import { ProductsAllComponent } from './productos/products-all/products-all.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareModule } from '../share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FacturaDetailComponent } from './facturas/factura-detail/factura-detail.component';
import { FacturasxclienteComponent } from './facturas/facturasxcliente/facturasxcliente.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ProductZoomComponent } from './productos/product-detail/product-zoom/product-zoom.component';


@NgModule({
  declarations: [
    ProductDetailComponent,
    ProductsAllComponent,
    FacturaDetailComponent,
    FacturasxclienteComponent,
    ProductZoomComponent

  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    NgxPaginationModule,
    ShareModule,
    ReactiveFormsModule,
  ]
})
export class ClienteModule { }
