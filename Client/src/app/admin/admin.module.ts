import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSearchPipe } from './usuarios/pipes/user-search.pipe';
import { AdminRoutingModule } from './admin-routing.module';
import { ShareModule } from '../share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatAdminComponent } from './chat-admin/chat-admin.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UserDialogComponent } from './usuarios/user-dialog/user-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [ChatAdminComponent, UsuariosComponent, UserDialogComponent, UserSearchPipe],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ],
})
export class AdminModule {}
