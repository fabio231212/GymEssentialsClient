import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User, UserService } from './user.service';
import { io, Socket } from 'socket.io-client';
// Definir clase con las propiedades que es necesario que gestione el carrito
export class UserChat {
  id: number;
  idSocket: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserChatService {
  private user: any;
  socket: Socket;
  socketId: string;
  private onlineUsers = new BehaviorSubject<UserChat[]>(null); //Definimos nuestro BehaviorSubject, este debe tener un valor inicial siempre
  public currentDataUserChat$ = this.onlineUsers.asObservable(); //Tenemos un observable con el valor actual del BehaviorSubject
  public qtyItems = new Subject<number>();
  constructor(private userService: UserService) {
    this.user = this.userService.currentUserValue;
    this.socket = io('http://localhost:8000');
    //Obtener los datos de la variable orden guardada en el localStorage
    this.onlineUsers = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('chatUsers'))
    );

    //Establecer un observable para los datos del carrito
    this.currentDataUserChat$ = this.onlineUsers.asObservable();

    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socket.emit('entrarChat', this.user, (resp: any) => {
        console.log('Usuarios conectados', resp);
        this.addToChat(resp);
      });
    });



  }
  saveCart(): void {
    localStorage.setItem(
      'chatUsers',
      JSON.stringify(this.onlineUsers.getValue())
    );
  }
  addToChat(userChat: any) {
    const netUserChat = new UserChat();
    //Armar instancia de User con los valores respectivos del producto
    //producto.id es cuando viene desde el boton comprar y trae la información del API
    netUserChat.id = userChat.idUser;
    netUserChat.idSocket = userChat.id;
    //Obtenemos el valor actual
    let listUserChat =
      this.onlineUsers.getValue() === null ? [] : this.onlineUsers.getValue();
    //Si no es el primer item del carrito
    if (listUserChat.length > 0) {
      //Buscamos si ya cargamos ese item en el carrito
      let objIndex = listUserChat.findIndex((obj) => obj.id == netUserChat.id);
      if (objIndex != -1) {
        return;
      }
    }

    listUserChat.push(netUserChat);

    this.onlineUsers.next(listUserChat); //Enviamos el valor al Observable

    //Actualizar la información en el localStorage
    this.saveCart();
  }

  public removeFromCart(newData: UserChat) {
    //Obtenemos la lista
    let listChat = this.onlineUsers.getValue();
    //Buscamos el item del chat para eliminar
    let objIndex = listChat.findIndex((obj) => obj.id == newData.id);
    if (objIndex != -1) {
      //Eliminamos el item del array del carrito
      listChat.splice(objIndex, 1);
    }
    this.onlineUsers.next(listChat); //Enviamos el valor al Observable

    //Actualizar la información en el localStorage
    this.saveCart();
  }
  //Obtener todos los items del carrito
  get getItems() {
    return this.onlineUsers.getValue();
  }
  //Gestiona el conteo de los items del carrito como un Observable
  get countItems(): Observable<number> {
    return this.qtyItems.asObservable();
  }
  setItems() {
    return this.onlineUsers.getValue();
  }

  //Borra toda los items del carrito
  public deleteCart() {
    this.onlineUsers.next(null); //Enviamos el valor al Observable
    //Actualizar cantidad de items a 0
    this.qtyItems.next(0);
    //Actualizar la información en el localStorage
    this.saveCart();
  }

  sendMessage(idVendedor: number | null, message: string) {
    // if (this.getItems != null) {
    //   this.socket.emit(
    //     'mensajePrivado',
    //     { para: this.socketId, mensaje: message },
    //     (resp: any) => {
    //       // console.log('respuesta server:', resp);
    //     }
    //   );
    // } else {
    //   this.socket.emit(
    //     'mensajePrivado',
    //     { para: idVendedor, mensaje: message },
    //     (resp: any) => {
    //       // console.log('respuesta server:', resp);
    //     }
    //   );
    // }
    this.socket.emit(
      'mensajePrivado',
      { para: idVendedor, mensaje: message },
      (resp: any) => {
        // console.log('respuesta server:', resp);
      }
    );
  }

  getMessage(): Observable<any> {
    return new Observable<{ user: string; message: string }>((observer) => {
      // Escuchar eventos de 'mensajePrivado' del servidor
      this.socket.on('mensajePrivado', (data: any) => {
        console.log('Mensaje recibido:', data);
        //  this.addToChat(data);
        this.socketId = data.id;
        observer.next(data);
      });
    });
  }

  getListaPersonas(): Observable<any> {
    return new Observable<{ user: any }>((observer) => {
      this.socket.on('listaPersona', (data: any) => {
        this.deleteCart();
        console.log('Usuarios conectados: ', data);
        data.forEach(element => {
          this.addToChat(element);
        });

        this.socketId = data.id;
        observer.next(data);
      });
    });
  }

  getDisconnected(): Observable<any> {
    return new Observable<{ user: string; message: string }>((observer) => {
      // Escuchar eventos de 'mensajePrivado' del servidor
      this.socket.on('disconnect', (resp: any) => {
        this.removeFromCart(resp);
        observer.next(resp);
      });
    });
  }

  // getNoti(): Observable<any> {
  //   return new Observable<{ user: string; message: string }>((observer) => {
  //     // Escuchar eventos de 'mensajePrivado' del servidor
  //     this.socket.on('noti', (data: any) => {
  //       this.addToChat(data);
  //       observer.next(data);
  //     });
  //   });
  // }
}
