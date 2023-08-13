import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import * as path from 'path';

const routes: Routes = [

  {
    path: 'login',
    component: IndexComponent,
    children: [
      {
        path: 'registrar',
        component: CreateComponent,
      },
      {
        path: '',
        component: LoginComponent,
      }
    ]
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
