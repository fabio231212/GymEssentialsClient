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
import { AdminComponent } from './admin.component';
import { MatIconModule } from '@angular/material/icon';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MenuComponent } from './components/menu/menu.component';
import { MessagesComponent } from './components/messages/messages.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FullScreenComponent } from './components/fullscreen/fullscreen.component';


@NgModule({
  declarations: [ChatAdminComponent, UsuariosComponent, UserDialogComponent, UserSearchPipe, AdminComponent,
    MenuComponent,
    UserMenuComponent,
    FullScreenComponent,
    MessagesComponent,
    BreadcrumbComponent],
  imports: [
    CommonModule,
    MatIconModule,
    AdminRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,

  ],
})
export class AdminModule { }
