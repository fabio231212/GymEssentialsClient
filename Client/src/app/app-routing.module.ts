import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './home/inicio/inicio.component';
import { TopMenuComponent } from './core/top-menu/top-menu.component';
import { NotificacionService } from './share/notification.service';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './share/auth.guard';

const routes: Routes = [
  // { path:'inicio',component: InicioComponent},
  // { path:'', redirectTo:'/inicio' ,pathMatch:'full'}

  {
    path: '', component: TopMenuComponent, children: [
      { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'cliente', loadChildren: () => import('./cliente/cliente-routing.module').then(m => m.ClienteRoutingModule)}
    ]
  },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: '', canActivate:[AuthGuard], loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule), },
    ]
  },
  {
    path: 'vendedor', component: AdminComponent, children: [
      { path: '', loadChildren: () => import('./vendedor/vendedor-routing.module').then(m => m.VendedorRoutingModule) },
    ]
  },
  { path: 'login', loadChildren: () => import('./usuarios/usuarios-routing.module').then(m => m.UsuariosRoutingModule), data: { breadcrumb: 'Cuenta ' } },
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
