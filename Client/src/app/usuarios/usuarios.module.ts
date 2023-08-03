import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { LoginComponent } from './login/login.component';
import { ShareModule } from '../share/share.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificacionService } from '../share/notification.service';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';

@NgModule({
  declarations: [LoginComponent, CreateComponent, IndexComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    ShareModule,
  ],
})
export class UsuariosModule {}
