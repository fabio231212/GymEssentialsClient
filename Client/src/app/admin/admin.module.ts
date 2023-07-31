import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ShareModule } from '../share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatAdminComponent } from './chat-admin/chat-admin.component';

@NgModule({
  declarations: [ChatAdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class AdminModule {}
