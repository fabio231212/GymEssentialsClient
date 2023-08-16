import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';
import { MatDialog } from '@angular/material/dialog';
import { GenericService } from '../generic.service';
import { CartService } from '../cart.service';
import { NotificacionService, TipoMessage } from '../notification.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  @Input('requireStockQuantity') requireStockQuantity: boolean;
  @Input() product: any;
  @Input() itemCart: any;
  @Input() type: string;
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  public count: number = 1;
  public align = 'center center';
  public precio: number;
  constructor(public appService: AppService, public snackBar: MatSnackBar, private gService: GenericService,
    private dialog: MatDialog,
    private cartService: CartService,
    private notificacion: NotificacionService, private userService: UserService) { }

  ngOnInit() {
    if (this.itemCart) {
      if (this.itemCart.cantidad > 0) {
        this.count = this.itemCart.cantidad;
      }
    }
    this.layoutAlign();
  }

  public layoutAlign() {
    if (this.type == 'all') {
      this.align = 'space-between center';
    } else if (this.type == 'wish') {
      this.align = 'start center';
    } else {
      this.align = 'center center';
    }
  }

  verifyRole() {
    if (this.userService.currentUserValue == null) {
      return false;
    }
    if (this.userService.currentUserValue.roles.some(role => ['Administrador', 'Vendedor'].includes(role)) &&
      !this.userService.currentUserValue.roles.includes('Comprador')) {
      return false;
    }
    return true;

  }

  public increment() {
    // this.precio =
    //   this.product.precioOferta > 0
    //     ? this.product.precioOferta
    //     : this.product.precio;
    // if (this.count < this.product.stock) {
    //   this.count++;
    //   this.product.cantidad = this.count;

    //   this.changeQuantity(this.product);
    // } else {
    //   this.snackBar.open(
    //     'La cantidad selecciona excede el stock disponible ' +
    //     this.count +
    //     ' items.',
    //     '×',
    //     { panelClass: 'error', verticalPosition: 'top', duration: 3000 }
    //   );
    // }
    this.precio =
      this.itemCart.product.precioOferta > 0
        ? this.itemCart.product.precioOferta
        : this.itemCart.product.precio;
    if (this.count < this.itemCart.product.stock) {
      this.count++;
      this.itemCart.cantidad = this.count;

      this.changeQuantity(this.itemCart);
    } else {
      this.snackBar.open(
        'La cantidad selecciona excede el stock disponible ' +
        this.count +
        ' items.',
        '×',
        { panelClass: 'error', verticalPosition: 'top', duration: 3000 }
      );
    }
  }

  public incrementItemCart() {
    this.precio =
      this.itemCart.product.precioOferta > 0
        ? this.itemCart.product.precioOferta
        : this.itemCart.product.precio;
    if (this.count < this.itemCart.product.stock) {
      this.count++;
      this.itemCart.product.cantidad = this.count;

      this.changeQuantity(this.itemCart);
    } else {
      this.snackBar.open(
        'La cantidad selecciona excede el stock disponible ' +
        this.count +
        ' items.',
        '×',
        { panelClass: 'error', verticalPosition: 'top', duration: 3000 }
      );
    }
  }

  public decrement() {
    // if (this.count > 1) {
    //   this.count--;
    //   this.product.cantidad = this.count;

    //   this.changeQuantity(this.product);
    // }
    if (this.count > 1) {
      this.count--;
      this.itemCart.cantidad = this.count;

      this.changeQuantity(this.itemCart);
    }
  }

  public addToCompare(product: Product) {
    this.appService.addToCompare(product);
  }

  public addToWishList(product: Product) {
    this.appService.addToWishList(product);
  }

  public addToCart(idProducto: number): void {
    // this.gService
    //   .get('productos', idProducto)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any) => {
    //Agregar videojuego obtenido del API al carrito

    this.cartService.addToCart(this.product);
    //Notificar al usuario
    this.notificacion.mensaje(
      'Orden',
      'Producto agregado a la orden',
      TipoMessage.success
    )
    // });
  }

  public openProductDialog(event) {
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value) {
    this.onQuantityChange.emit(value);
  }
}
