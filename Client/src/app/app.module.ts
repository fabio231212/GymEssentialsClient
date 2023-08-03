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
import { SwiperModule } from './core/swiper/swiper.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ToastrModule } from 'ngx-toastr';
import { AdminModule } from './admin/admin.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    GoogleMapsModule,
    NgxSpinnerModule, // importar HttpClientModule después BrowserModule.
    // comunicarse con un servidor a través del protocolo HTTP
    HttpClientModule,
    // importar los módulos creados propios en orden
    CoreModule,
    ShareModule,
    HomeModule,
    FacturasModule,
    ProductosModule,
    UsuariosModule,
    // al final el gestor de las rutas principal
    AppRoutingModule,
    SwiperModule,
    UsuariosModule,
    AdminModule,
  ],
  providers: [AppSettings, AppService],
  bootstrap: [AppComponent],
})
export class AppModule {}
