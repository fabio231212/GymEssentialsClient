import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'; 
import { SwiperConfigInterface } from '../../core/swiper/swiper.module';
import { MatDialog } from '@angular/material/dialog';
import { Data, AppService } from '../../app.service';
import { Settings, AppSettings } from 'src/app/app.settings';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss']
})
export class RelatedProductsComponent implements OnInit {

  @Input('relatedProducts') relatedProducts: Array<any> = [];
  @Input('idProducto') idProducto: number;
  
  public config: SwiperConfigInterface = {};
  public settings: Settings;
  public isRelatedProduct:boolean = true;
  constructor(public appSettings:AppSettings, public appService:AppService, public dialog: MatDialog, private router: Router) { 
    this.settings = this.appSettings.settings;
  }

  
  ngOnInit() { }
  
  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 16,       
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,  
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2
        },
        960: {
          slidesPerView: 3
        },
        1280: {
          slidesPerView: 4
        },
        1500: {
          slidesPerView: 5
        }
      }
    }
  }
}
