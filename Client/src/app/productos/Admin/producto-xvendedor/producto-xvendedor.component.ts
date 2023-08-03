import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();
  isAutenticated: boolean;
  currentUser: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource= new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'precio','stock','descripcion','acciones'];

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
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;        
      });   
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
