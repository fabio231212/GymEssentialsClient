import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './home/inicio/inicio.component';
import { TopMenuComponent } from './core/top-menu/top-menu.component';
import { NotificacionService } from './share/notification.service';

const routes: Routes = [
  // { path:'inicio',component: InicioComponent},
  // { path:'', redirectTo:'/inicio' ,pathMatch:'full'}
  {
    path: '', component: TopMenuComponent, children: [
      { path: '', loadChildren: () => import('./home/home-routing.module').then(m => m.HomeRoutingModule) },
      // { path: 'account', loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule), data: { breadcrumb: 'Account Settings' } },
      // { path: 'compare', loadChildren: () => import('./pages/compare/compare.module').then(m => m.CompareModule), data: { breadcrumb: 'Compare' } },
      // { path: 'wishlist', loadChildren: () => import('./pages/wishlist/wishlist.module').then(m => m.WishlistModule), data: { breadcrumb: 'Wishlist' } },
      // { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule), data: { breadcrumb: 'Cart' } },
      // { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule), data: { breadcrumb: 'Checkout' } },
      // { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule), data: { breadcrumb: 'Contact' } },
      { path: 'log-in', loadChildren: () => import('./usuarios/usuarios-routing.module').then(m => m.UsuariosRoutingModule), data: { breadcrumb: 'Sign In ' } },
      // { path: 'brands', loadChildren: () => import('./pages/brands/brands.module').then(m => m.BrandsModule), data: { breadcrumb: 'Brands' } },
      { path: 'cliente', loadChildren: () => import('./cliente/cliente-routing.module').then(m => m.ClienteRoutingModule), data: { breadcrumb: 'All Products' } }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
