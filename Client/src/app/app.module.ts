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

import { HttpClientModule } from '@angular/common/http';
import { AppSettings } from './app.settings';
import { AppService } from './app.service';
import { SwiperModule } from './core/swiper/swiper.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ToastrModule } from 'ngx-toastr';
import { AdminModule } from './admin/admin.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClienteModule } from './cliente/cliente.module';
import { VendedorModule } from './vendedor/vendedor.module';

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
    UsuariosModule,
    AdminModule,
    ClienteModule,
    VendedorModule,
    // importar los módulos creados propios en orden
    CoreModule,
    ShareModule,
    HomeModule,
    UsuariosModule,
    SwiperModule,
    AppRoutingModule,
  ],
  providers: [AppSettings, AppService],
  bootstrap: [AppComponent],
})
export class AppModule { }
