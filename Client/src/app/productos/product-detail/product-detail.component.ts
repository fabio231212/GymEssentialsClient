import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SwiperConfigInterface, SwiperDirective } from '../../core/swiper/swiper.module';
import { Data, AppService } from '../../app.service';
import { Product } from "../../app.models";
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { GenericService } from 'src/app/share/generic.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent  {
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface={};
  public product: Product;
  public image: any;
  public zoomImage: any;
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();
  public form: UntypedFormGroup;
  public relatedProducts: Array<Product>;

  constructor(public appService:AppService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, 
    public formBuilder: UntypedFormBuilder,private gService: GenericService,
    private route:ActivatedRoute
    ){
      let id=this.route.snapshot.paramMap.get('idProducto');
      if(!isNaN(Number(id))){
        this.getProductById(Number(id));
      }}

  ngAfterViewInit(){
    this.config = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 10,      
      keyboard: true,
      navigation: true,
      pagination: false,       
      loop: false, 
      preloadImages: false,
      lazy: true, 
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    }
  }


  getProductById(idProducto:any){
    //localhost:3000/videojuego
    this.gService.list('productos/'+idProducto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log(data);
        this.datos=data;    
        this.image=this.datos.imagenes.URL;  
      });   
  }
  // public getRelatedProducts(){
  //   this.appService.getProducts('related').subscribe(data => {
  //     this.relatedProducts = data;
  //   })
  // }

  public selectImage(image){
    this.image = image.medium;
    this.zoomImage = image.big;
  }

  public onMouseMove(e){
    if(window.innerWidth >= 1280){
      var image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget; 
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX/image.offsetWidth*100;
      y = offsetY/image.offsetHeight*100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if(zoomer){
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = "block";
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  public onMouseLeave(event){
    this.zoomViewer.nativeElement.children[0].style.display = "none";
  }

  public openZoomViewer(){
    this.dialog.open(ProductZoomComponent, {
      data: this.zoomImage,
      panelClass: 'zoom-dialog'
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  } 


}