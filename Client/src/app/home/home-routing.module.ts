import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { Socket } from 'socket.io-client';
import { SocketGuard } from '../share/Socket.guard';

export const routes: Routes = [
  { path: 'Inicio', component: InicioComponent, canActivate: [SocketGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }