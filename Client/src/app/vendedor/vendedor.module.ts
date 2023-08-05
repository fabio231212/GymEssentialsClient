import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendedorRoutingModule } from './vendedor-routing.module';
import { ProdfactxvendedorComponent } from './facturas/prodfactxvendedor/prodfactxvendedor.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareModule } from '../share/share.module';
import { Product } from '../app.models';
import { ProductoXVendedorComponent } from './productos/producto-xvendedor/producto-xvendedor.component';
import { ProductosFormComponent } from './productos/productos-form/productos-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    ProdfactxvendedorComponent,
    ProductoXVendedorComponent,
    ProductosFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    VendedorRoutingModule,
    NgxPaginationModule,
    ShareModule,
  ]
})
export class VendedorModule { }
