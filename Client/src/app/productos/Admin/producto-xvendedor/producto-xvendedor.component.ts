import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-producto-xvendedor',
  templateUrl: './producto-xvendedor.component.html',
  styleUrls: ['./producto-xvendedor.component.scss']
})
export class ProductoXVendedorComponent   {
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource= new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'precio','stock','descripcion','acciones'];

  constructor(private router:Router,
    private route:ActivatedRoute,
    private gService:GenericService) {
    
      let id=this.route.snapshot.paramMap.get('idVendedor');
      if(!isNaN(Number(id))){
        this.listaProductoXvendedor(Number(id));
      }
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
  // actualizarVideojuego(id: number) {
  //   this.router.navigate(['/videojuego/update', id], {
  //     relativeTo: this.route,
  //   });
  // }

  // crearVideojuego() {
  //   this.router.navigate(['/videojuego/create'], {
  //     relativeTo: this.route,
  //   });
  // }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
