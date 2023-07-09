import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  @Input('requireStockQuantity') requireStockQuantity: boolean;
  @Input() product: any;
  @Input() type: string;
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  public count: number = 1;
  public align = 'center center';
  public precio: number;
  constructor(public appService: AppService, public snackBar: MatSnackBar) {}

  ngOnInit() {
    if (this.product) {
      if (this.product.cartCount > 0) {
        this.count = this.product.cartCount;
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

  public increment() {
    this.precio =
      this.product.precioOferta > 0
        ? this.product.precioOferta
        : this.product.precio;
    if (this.count < this.product.stock) {
      this.count++;
      let obj = {
        productId: this.product.id,
        stock: this.count,
        precio: this.precio,
        total: this.count * this.precio,
      };
      this.changeQuantity(obj);
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
    if (this.count > 1) {
      this.count--;
      let obj = {
        productId: this.product.id,
        stock: this.count,
        precio: this.precio,
        total: this.count * this.precio,
      };
      this.changeQuantity(obj);
    }
  }

  public addToCompare(product: Product) {
    this.appService.addToCompare(product);
  }

  public addToWishList(product: Product) {
    this.appService.addToWishList(product);
  }

  public addToCart(product: Product): void {
    const currentProduct = this.appService.Data.cartList.find(
      (item) => item.id === product.id
    );
    if (currentProduct) {
      const availableCount = this.product.availibilityCount;
      const addedCount = currentProduct.cartCount + this.count;

      if (addedCount <= availableCount) {
        product.cartCount = addedCount;
      } else {
        const errorMessage = `You cannot add more items than available. In stock ${availableCount} items and you already added ${currentProduct.cartCount} item(s) to your cart`;
        this.snackBar.open(errorMessage, '×', {
          panelClass: 'error',
          verticalPosition: 'top',
          duration: 5000,
        });
        return;
      }
    } else {
      product.cartCount = this.count;
    }
    this.appService.addToCart(product);
  }

  public openProductDialog(event) {
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value) {
    this.onQuantityChange.emit(value);
  }
}
