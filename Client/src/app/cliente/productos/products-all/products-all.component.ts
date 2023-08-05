import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppSettings, Settings } from 'src/app/app.settings';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-products-all',
  templateUrl: './products-all.component.html',
  styleUrls: ['./products-all.component.scss'],
})
export class ProductsAllComponent implements OnInit {
  public sidenavOpen: boolean = true;
  private sub: any;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36];
  public count: any;
  public requireStockQuantity: boolean = false;
  public categorias: any[];
  public marcas: any[];
  public tamanos: any[];
  public priceFrom: number = 0;
  public priceTo: number = 100;
  public page: any;
  public settings: Settings;
  public datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Lista de marcas
  marcasList: any;
  //Lista de tamaños
  tamannosList: any;
  //Lista de categorias
  categoriasList: any;
  //Lista de estados
  estadosList: any;
  constructor(
    private gService: GenericService,
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.count = this.counts[0];
    this.sub = this.activatedRoute.params.subscribe((params) => {
      //console.log(params['name']);
    });
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }

    this.listaProductos();
    this.listaCategorias();
    this.listaMarcas();
    this.listaTamannos();
    this.listaEstadosProductos();
  }

  listaMarcas() {
    this.marcasList = null;
    this.gService
      .list('marcas')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.marcasList = data;
      });
  }

  listaTamannos() {
    this.tamannosList = null;
    this.gService
      .list('tamannos')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.tamannosList = data;
      });
  }

  listaCategorias() {
    this.categoriasList = null;
    this.gService
      .list('categorias')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.categoriasList = data;
      });
  }

  listaEstadosProductos() {
    this.estadosList = null;
    this.gService
      .list('estadoproducto')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.estadosList = data;
      });
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    window.innerWidth < 960
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
    window.innerWidth < 1280 ? (this.viewCol = 33.3) : (this.viewCol = 25);
  }

  public changeCount(count) {
    this.count = count;
    this.listaProductos();
  }

  // public changeSorting(sort){
  //   this.sort = sort;
  // }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public onPageChanged(event) {
    this.page = event;
    this.listaProductos();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  listaProductos() {
    this.gService
      .list('productos/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.datos = data;
      });
  }
}
