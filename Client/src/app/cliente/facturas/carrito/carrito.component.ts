import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { CartService } from 'src/app/share/cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  total = [];
  grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  cartList: any[];
  qtyItems: number = 0;

  constructor(public appService: AppService, public cartService: CartService) {
    this.qtyItems = this.cartService.quantityItems()
  }

  ngOnInit() {
    this.cartService.currentDataCart$.subscribe(data => {
      this.cartList = data;
    })

    this.cartService.countItems.subscribe((value) => {
      this.qtyItems = value;
    })
    this.cartList.forEach(item => {
      this.cartItemCount[item.idItem] = item.cantidad;
      this.cartItemCountTotal += item.cantidad;
    })
  }
  public updateCart(value) {
    if (value) {
      this.cartService.addToCart(value);
    }
  }

  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.grandTotal = this.grandTotal - this.total[product.id];
      this.appService.Data.totalPrice = this.grandTotal;
      this.total.forEach(val => {
        if (val == this.total[product.id]) {
          this.total[product.id] = 0;
        }
      });

      this.cartItemCountTotal = this.cartItemCountTotal - this.cartItemCount[product.id];
      this.appService.Data.totalCartCount = this.cartItemCountTotal;
      this.cartItemCount.forEach(val => {
        if (val == this.cartItemCount[product.id]) {
          this.cartItemCount[product.id] = 0;
        }
      });
      this.appService.resetProductCartCount(product);
    }
  }

  public clear() {
    this.appService.Data.cartList.forEach(product => {
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }

}
