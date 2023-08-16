import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-producto-xvendedor',
  templateUrl: './producto-xvendedor.component.html',
  styleUrls: ['./producto-xvendedor.component.scss']
})
export class ProductoXVendedorComponent implements OnInit  {
  datos:any[]=[];
  destroy$:Subject<boolean>=new Subject<boolean>();
  isAutenticated: boolean;
  currentUser: any;
  public viewCol: number = 25;
  public page: any;
  public count = 12;



  constructor(private router:Router,
    private route:ActivatedRoute,
    private gService:GenericService,
    private authService: UserService,) {
    
      let id=this.route.snapshot.paramMap.get('idVendedor');
      if(!isNaN(Number(id))){
        this.listaProductoXvendedor(Number(id));
      }
  }

  
  ngOnInit() {
    //Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    //Subscripción al boolean que indica si esta autenticado
    this.authService.isAuthenticated.subscribe((valor)=>(this.isAutenticated=valor));

 }

  listaProductoXvendedor(idVendedor:any){
    //localhost:3000/videojuego
    this.gService.list('productos/idVendedor/'+idVendedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log(data);
        this.datos=data;      
      });   
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  @HostListener('window:resize')
  public onWindowResize():void { 
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }
 
  // detalle(id:number){
  //   this.router.navigate(['/videojuego',id],
  //   {
  //     relativeTo:this.route
  //   })
  // }
  actualizarProducto(id: number) {
    this.router.navigate(['/productos/editar', id], {
      relativeTo: this.route,
    });
  }

  crearProducto() {
    this.router.navigate(['/productos/crear'], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
