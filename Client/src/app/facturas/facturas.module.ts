import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { FacturasRoutingModule } from './facturas-routing.module';
import { FacturasxclienteComponent } from './facturasxcliente/facturasxcliente.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShareModule } from '../share/share.module';
import { FacturaDetailComponent } from './factura-detail/factura-detail.component';

@NgModule({
  providers: [DatePipe],
  declarations: [FacturasxclienteComponent, FacturaDetailComponent],
  imports: [
    CommonModule,
    FacturasRoutingModule,
    NgxPaginationModule,
    ShareModule,
  ],
})
export class FacturasModule {}
