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
import { FacturaDetailComponent } from './facturas/factura-detail/factura-detail.component';
import { EvaluacionUsuarioComponent } from './facturas/evaluacion-usuario/evaluacion-usuario.component';




@NgModule({
  declarations: [
    ProdfactxvendedorComponent,
    ProductoXVendedorComponent,
    ProductosFormComponent,
    FacturaDetailComponent,
    EvaluacionUsuarioComponent
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
