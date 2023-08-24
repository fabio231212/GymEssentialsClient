import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppSettings, Settings } from 'src/app/app.settings';
import { UserChatService } from 'src/app/share/chat.Service';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-products-all',
  templateUrl: './products-all.component.html',
  styleUrls: ['./products-all.component.scss'],
})
export class ProductsAllComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
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
   priceFrom = 0;
   priceTo: number = 100;
  public page: any;
  public settings: Settings;
  public datos: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Lista de marcas
  marcasList: any;
  //Lista de tamaños
  tamannosList: any;
  //Lista de categorias
  categoriasList: any;
  //Lista de estados
  estadosList: any;

  selectedBrands: any[] = [];
  selectedSizes: any[] = [];
  selectedStates: any[] = [];
  datosFiltrados: any[] = [];
  selectedCategories: any = '';

  constructor(
    private gService: GenericService,
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private chatService: UserChatService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.count = this.counts[0];
    this.sub = this.activatedRoute.params.subscribe((params) => {
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

  async applyFilters() {
    this.datosFiltrados = this.datos.filter((product) => {
      const brandMatch =
        this.selectedBrands.length === 0 ||
        product.marcas.some((marca) =>
          this.selectedBrands.includes(marca.descripcion)
        );
      const sizeMatch =
        this.selectedSizes.length === 0 ||
        product.tamannos.some((tam) =>
        this.selectedSizes.includes(tam.descripcion)
      );
      const categoryMatch =
      this.selectedCategories === '' || 
      product.categoriaProducto.descripcion === this.selectedCategories;

      const estadoMatch = this.selectedStates.length === 0 ||
      this.selectedStates.includes(product.estadoProducto.descripcion);

      const priceMatch = product.descuento > 0 ? product.precioOferta >= this.priceFrom && product.precioOferta <= this.priceTo :
      product.precio >= this.priceFrom && product.precio <= this.priceTo;

    return brandMatch && sizeMatch && categoryMatch && estadoMatch && priceMatch;
    });
  }


  async toggleMarca(brand: string) {
    if (this.selectedBrands.includes(brand)) {
      this.selectedBrands = this.selectedBrands.filter((b) => b !== brand);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }

 async toggleSize(size: string) {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter((s) => s !== size);
    } else {
      this.selectedSizes.push(size);
    }
    this.applyFilters();
  }

  async toggleCategoria(cat: string) {
    if (this.selectedCategories === cat || cat === '') {
      this.selectedCategories = ''; // Restablecer la categoría seleccionada
    } else {
      this.selectedCategories = cat; // Establecer la categoría seleccionada
    }
    this.applyFilters();
  }

  toggleEstado(est: any) {
    if (this.selectedStates.includes(est)) {
      this.selectedStates = this.selectedStates.filter((e) => e !== est);
    } else {
      this.selectedStates.push(est);
    }
    this.applyFilters();
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
        this.datosFiltrados = data;
      });
  }
}
