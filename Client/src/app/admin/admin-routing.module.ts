import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatAdminComponent } from './chat-admin/chat-admin.component';
import { AuthGuard } from '../share/auth.guard';

const routes: Routes = [
  {
    path: 'adminChat',
    component: ChatAdminComponent,
    //canActivate: [AuthGuard],
    data: {
      roles: ['Administrador', 'Vendedor', 'Comprador'],
      breadcrumb: 'Lista de Producto',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
