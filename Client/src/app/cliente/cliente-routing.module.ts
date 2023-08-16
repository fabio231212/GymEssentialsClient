import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsAllComponent } from './productos/products-all/products-all.component';
import { ProductDetailComponent } from './productos/product-detail/product-detail.component';
import { FacturasxclienteComponent } from './facturas/facturasxcliente/facturasxcliente.component';
import { AuthGuard } from '../share/auth.guard';
import { FacturaDetailComponent } from './facturas/factura-detail/factura-detail.component';
import { CarritoComponent } from './facturas/carrito/carrito.component';
import { CheckoutComponent } from './facturas/checkout/checkout.component';

const routes: Routes = [

  {
    path: 'carrito',
    component: CarritoComponent,
    data: { breadcrumb: 'Carrito' },
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    data: { breadcrumb: 'Checkout' },
  },

  {
    path: 'productos',
    component: ProductsAllComponent,
    data: { breadcrumb: 'Lista de Producto' },
  },

  {
    path: 'productos/:idProducto',
    component: ProductDetailComponent,
    data: {
      breadcrumb: 'Detalle de Producto',
    },
  },
  {
    path: 'facturas/facturasxusuario/:idUsuario',
    component: FacturasxclienteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor', 'Comprador'], breadcrumb: 'Facturas por Usuario' },
  },
  {
    path: 'facturas/facturaDetalle/:idFactura',
    component: FacturaDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Vendedor', 'Comprador'], breadcrumb: 'Facturas Detalle' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ClienteRoutingModule {


}
