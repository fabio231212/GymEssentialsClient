import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from './dashboard.component';
import { TilesComponent } from './tiles/tiles.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { MontlySalesComponent } from './montly-sales/montly-sales.component';
import { LatestOrdersComponent } from './latest-orders/latest-orders.component';
import { TopConsumerBySellerComponent } from './top-consumer-by-seller/top-consumer-by-seller.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    DashboardComponent,
    TilesComponent,
    InfoCardsComponent,
    AnalyticsComponent,
    MontlySalesComponent,
    LatestOrdersComponent,
    TopConsumerBySellerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ShareModule,
    NgxChartsModule
  ]
})
export class DashboardModule { }
