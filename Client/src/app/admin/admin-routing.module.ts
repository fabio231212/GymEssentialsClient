import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatAdminComponent } from './chat-admin/chat-admin.component';
import { AuthGuard } from '../share/auth.guard';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminComponent } from './admin.component';
import { VendedorRoutingModule } from '../vendedor/vendedor-routing.module';

const routes: Routes = [

  { 
    path: 'admin', 
    component: AdminComponent, canActivate:[AuthGuard],
    data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'DashBoard' },
    children: [
      {path: 'vendedor', loadChildren: () => import('../vendedor/vendedor-routing.module').then(m => m.VendedorRoutingModule) },
      {path: 'usuarios',component: UsuariosComponent, canActivate:[AuthGuard], data: { roles: ['Administrador'], breadcrumb: 'Lista de Usuarios' }},
      {path: 'adminChat',component: ChatAdminComponent,data: { roles: ['Administrador', 'Vendedor'], breadcrumb: 'Chat' }},  
    ]
  } 
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
