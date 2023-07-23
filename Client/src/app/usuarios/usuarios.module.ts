import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { LoginComponent } from './login/login.component';
import { ShareModule } from '../share/share.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificacionService } from '../share/notification.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    ShareModule,
  ],
})
export class UsuariosModule {}
