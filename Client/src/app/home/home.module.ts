import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShareModule } from '../share/share.module';
// import { HomeComponent } from './home.component';
import { InicioComponent } from './inicio/inicio.component';



@NgModule({
  imports: [
    CommonModule,
    ShareModule
  ],
  declarations: [
    InicioComponent
  ]
})
export class HomeModule { }
