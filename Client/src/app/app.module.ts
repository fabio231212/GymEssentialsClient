// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { GoogleMapsModule } from '@angular/google-maps';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { CoreModule } from './core/core.module';
// import { ShareModule } from './share/share.module';
// import { HomeModule } from './home/home.module';

// import { HttpClientModule } from '@angular/common/http';
// import { AppSettings } from './app.settings';
// import { AppService } from './app.service';
// import { SwiperModule } from './core/swiper/swiper.module';
// import { UsuariosModule } from './usuarios/usuarios.module';
// import { ToastrModule } from 'ngx-toastr';
// import { AdminModule } from './admin/admin.module';
// import { ReactiveFormsModule } from '@angular/forms';
// import { ClienteModule } from './cliente/cliente.module';
// import { VendedorModule } from './vendedor/vendedor.module';

// @NgModule({
//   declarations: [AppComponent],
//   imports: [
//     BrowserModule,
//     ReactiveFormsModule,
//     ToastrModule.forRoot(),
//     BrowserAnimationsModule,
//     GoogleMapsModule,
//     NgxSpinnerModule, // importar HttpClientModule después BrowserModule.
//     // comunicarse con un servidor a través del protocolo HTTP
//     HttpClientModule,
//     UsuariosModule,
//     AdminModule,
//     ClienteModule,
//     VendedorModule,
//     // importar los módulos creados propios en orden
//     CoreModule,
//     ShareModule,
//     HomeModule,
//     UsuariosModule,
//     SwiperModule,
//     AppRoutingModule,
//   ],
//   providers: [AppSettings, AppService],
//   bootstrap: [AppComponent],
// })
// export class AppModule { }


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GoogleMapsModule } from '@angular/google-maps';

import { OverlayContainer, Overlay } from '@angular/cdk/overlay';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { CustomOverlayContainer } from './utils/custom-overlay-container';
import { menuScrollStrategy } from './utils/scroll-strategy';

import { environment } from 'src/environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
export function HttpLoaderFactory(httpClient: HttpClient) { 
  return new TranslateHttpLoader(httpClient, environment.apiURL +'/assets/i18n/', '.json');
}

import { ShareModule } from './share/share.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ClienteModule } from './cliente/cliente.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AdminModule } from './admin/admin.module';
import { AppSettings } from './app.settings';
import { AppService } from './app.service';
import { AppInterceptor } from './utils/app-interceptor';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';


@NgModule({
   imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    NgxSpinnerModule,
    GoogleMapsModule,
        ClienteModule,
    VendedorModule,
    CoreModule,
    UsuariosModule,
    AdminModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ShareModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
  ], 
  providers: [
    AppSettings,
    AppService,   
    DatePipe,
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: MAT_MENU_SCROLL_STRATEGY, useFactory: menuScrollStrategy, deps: [Overlay] },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
