import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GoogleMapsModule } from '@angular/google-maps';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { FacturasModule } from './facturas/facturas.module';
import { ProductosModule } from './productos/productos.module';
import { HttpClientModule } from '@angular/common/http';

import { AppSettings } from './app.settings';
import { AppService } from './app.service';

@NgModule({
declarations: [AppComponent],
imports: [
BrowserModule, 
BrowserAnimationsModule,
GoogleMapsModule,
NgxSpinnerModule,// importar HttpClientModule después BrowserModule.
// comunicarse con un servidor a través del protocolo HTTP
HttpClientModule, 
// importar los módulos creados propios en orden
CoreModule,
ShareModule,
HomeModule,
FacturasModule,
ProductosModule,
// al final el gestor de las rutas principal
AppRoutingModule,
],
providers: [    AppSettings,
    AppService ],
bootstrap: [AppComponent],
})
export class AppModule {}