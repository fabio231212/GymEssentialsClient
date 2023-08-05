import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatAdminComponent } from './chat-admin/chat-admin.component';
import { AuthGuard } from '../share/auth.guard';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: 'admin/inicio',
    component: AdminComponent,
    data: {
      roles: ['Administrador', 'Vendedor',],
    },
  },
  {
    path: 'admin/adminChat',
    component: ChatAdminComponent,
    //canActivate: [AuthGuard],
    data: {
      roles: ['Administrador', 'Vendedor', 'Comprador'],
      breadcrumb: 'Lista de Producto',
    },
  },
  {
    path: 'admin/usuarios',
    component: UsuariosComponent,
    data: { roles: ['Administrador'], breadcrumb: 'Lista de Usuarios' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
