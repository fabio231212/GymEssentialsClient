import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, Product } from './app.models';
import { environment } from 'src/environments/environment';  

export class Data {
    constructor(public categories: Category[],
                public compareList: Product[],
                public wishList: Product[],
                public cartList: Product[],
                public totalPrice: number,
                public totalCartCount: number) { }
}

@Injectable()
export class AppService {
    public Data = new Data(
        [], // categories
        [], // compareList
        [],  // wishList
        [],  // cartList
        null, //totalPrice,
        0 //totalCartCount
    )
    
    public url = 'http://localhost:4200/assets/data/'; 

    constructor(public http:HttpClient, public snackBar: MatSnackBar) { }
    

    public getBanners(): Observable<any[]>{
        return this.http.get<any[]>(this.url + 'banners.json');
    }

    public addToCompare(product:Product){
        let message, status;
        if(this.Data.compareList.filter(item=>item.id == product.id)[0]){
            message = 'The product ' + product.name + ' already added to comparison list.'; 
            status = 'error';     
        }
        else{
            this.Data.compareList.push(product);
            message = 'The product ' + product.name + ' has been added to comparison list.'; 
            status = 'success';  
        }
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }

    public addToWishList(product:Product){
        let message, status;
        if(this.Data.wishList.filter(item=>item.id == product.id)[0]){
            message = 'The product ' + product.name + ' already added to wish list.'; 
            status = 'error';     
        }
        else{
            this.Data.wishList.push(product);
            message = 'The product ' + product.name + ' has been added to wish list.'; 
            status = 'success';  
        }
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    } 

    public addToCart(product:Product){
        let message, status;        
       
        this.Data.totalPrice = null;
        this.Data.totalCartCount = null;

        if(this.Data.cartList.filter(item=>item.id == product.id)[0]){ 
            let item = this.Data.cartList.filter(item=>item.id == product.id)[0];
            item.cartCount = product.cartCount;  
        }
        else{           
            this.Data.cartList.push(product);
        }        
        this.Data.cartList.forEach(product=>{
            this.Data.totalPrice = this.Data.totalPrice + (product.cartCount * product.newPrice);
            this.Data.totalCartCount = this.Data.totalCartCount + product.cartCount;
        });

        message = 'The product ' + product.name + ' has been added to cart.'; 
        status = 'success';          
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }

    public resetProductCartCount(product:Product){
        product.cartCount = 0;
        let compareProduct = this.Data.compareList.filter(item=>item.id == product.id)[0];
        if(compareProduct){
            compareProduct.cartCount = 0;
        };
        let wishProduct = this.Data.wishList.filter(item=>item.id == product.id)[0];
        if(wishProduct){
            wishProduct.cartCount = 0;
        }; 
    }

    public getBrands(){
        return [  
            { name: 'aloha', image: '../assets/images/brands/aloha.png' },
            { name: 'dream', image: '../assets/images/brands/dream.png' },  
            { name: 'congrats', image: '../assets/images/brands/congrats.png' },
            { name: 'best', image: '../assets/images/brands/best.png' },
            { name: 'original', image: '../assets/images/brands/original.png' },
            { name: 'retro', image: '../assets/images/brands/retro.png' },
            { name: 'king', image: '../assets/images/brands/king.png' },
            { name: 'love', image: '../assets/images/brands/love.png' },
            { name: 'the', image: '../assets/images/brands/the.png' },
            { name: 'easter', image: '../assets/images/brands/easter.png' },
            { name: 'with', image: '../assets/images/brands/with.png' },
            { name: 'special', image: '../assets/images/brands/special.png' },
            { name: 'bravo', image: '../assets/images/brands/bravo.png' }
        ];
    }

    public getDeliveryMethods(){
        return [
            { value: 'free', name: 'Free Delivery', desc: '$0.00 / Delivery in 7 to 14 business Days' },
            { value: 'standard', name: 'Standard Delivery', desc: '$7.99 / Delivery in 5 to 7 business Days' },
            { value: 'express', name: 'Express Delivery', desc: '$29.99 / Delivery in 1 business Days' }
        ]
    }

} 