import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [{
  path: 'usuario', component: IndexComponent,children: [
    {
      path: 'registrar',
      component: CreateComponent,
    },
    {
      path: 'login',
      component: LoginComponent,
    }
  ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
