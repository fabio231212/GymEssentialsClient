import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MenuComponent } from './menu/menu.component';
import { OptionsComponent } from './options/options.component';
import { SidenavMenuComponent } from './sidenav-menu/sidenav-menu.component';
import { SwiperComponent } from './swiper/swiper.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { ShareModule } from '../share/share.module';

@NgModule({
  declarations: [
    FooterComponent,
    BreadcrumbComponent,
    MenuComponent,
    OptionsComponent,
    SidenavMenuComponent,
    //  SwiperComponent,
    TopMenuComponent,
  ],
  imports: [CommonModule, ShareModule],
  exports: [
    FooterComponent,
    BreadcrumbComponent,
    MenuComponent,
    OptionsComponent,
    SidenavMenuComponent,
    // SwiperComponent,
    TopMenuComponent,
  ],
})
export class CoreModule {}
