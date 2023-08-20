import { orders, products, customers, refunds } from '../dashboard.data';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  cantCompras: number;
  cantUsuarios: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe, private userService: UserService) { }

  ngOnInit(): void {
    this.getCantCompras();
    this.getCantidadUsuarios();
  }

  getCantCompras() {
    this.gService
      .list('facturas/numVentasCurrentDay/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.cantCompras = data;
      });
  }
  getCantidadUsuarios() {
    this.gService
      .list('usuarios/cantidad/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.cantUsuarios = data;
      });
  }
}
