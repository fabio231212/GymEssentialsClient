import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { ShareModule } from '../share/share.module';
import { RouterModule, Routes } from '@angular/router';
import { SocketGuard } from '../share/Socket.guard';

export const routes: Routes = [
  { path: '', component: InicioComponent, canActivate: [SocketGuard] }
];

@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ShareModule,
  ]
})
export class HomeModule { }