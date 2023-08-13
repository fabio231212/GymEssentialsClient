import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User, UserService } from './user.service';
import { io, Socket } from 'socket.io-client';
// Definir clase con las propiedades que es necesario que gestione el carrito
export class UserChat {
  id: number;
  idSocket: string;
}
export class Message {
  id: number;
  idSocket: string;
  from: string;
  message: string;
  date: Date;
  isSended: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class UserChatService {
  private user: any;
  socket: Socket;
  socketId: string;
  private messagesSubject = new BehaviorSubject<Message[]>(null);
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();
  private socketInitializedSubject = new BehaviorSubject<boolean>(false);
  public socketInitialized$: Observable<boolean> = this.socketInitializedSubject.asObservable();
  private onlineUsers = new BehaviorSubject<UserChat[]>(null); //Definimos nuestro BehaviorSubject, este debe tener un valor inicial siempre
  public currentDataUserChat$ = this.onlineUsers.asObservable(); //Tenemos un observable con el valor actual del BehaviorSubject
  constructor(private userService: UserService) {

    this.user = this.userService.currentUserValue;

    //Obtener los datos de la variable orden guardada en el localStorage
    this.onlineUsers = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('chatUsers'))

    );
    this.messagesSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('messages'))
    );

    //Establecer un observable para los datos del carrito
    this.currentDataUserChat$ = this.onlineUsers.asObservable();




  }
  initializeSocket() {
    this.user = this.userService.currentUserValue;
    this.socket = io('http://localhost:8000');
    this.socket.connect();

    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketInitializedSubject.next(true);
      this.socket.emit('entrarChat', this.user, (resp: any) => {
        console.log('Usuarios conectados', resp);
        this.addToChat(resp);

      });
    });

    // Otras configuraciones y lógica del socket
  }

  isSocketInitialized(): boolean {
    return this.socketInitializedSubject.getValue();
  }

  saveUsers(): void {
    localStorage.setItem(
      'chatUsers',
      JSON.stringify(this.onlineUsers.getValue())
    );
  }
  saveMessages(): void {
    localStorage.setItem(
      'messages',
      JSON.stringify(this.messagesSubject.getValue())
    );
  }

  addMessage(message: Message) {
    const currentMessages = this.messagesSubject.getValue() === null ? [] : this.messagesSubject.getValue();
    this.messagesSubject.next([...currentMessages, message]);
    this.saveMessages();
  }

  clearMessages() {
    this.messagesSubject.next([]);
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
    this.saveUsers();
  }




  get getMessages() {
    return this.messagesSubject.getValue();
  }



  public deleteData() {
    this.onlineUsers.next(null); //Enviamos el valor al Observable
    this.messagesSubject.next(null);
    //Actualizar cantidad de items a 0
    //Actualizar la información en el localStorage
    this.saveUsers();
    this.saveMessages();
  }

  sendMessage(idVendedor: number | null, message: string) {
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
        this.deleteData();
        console.log('Usuarios conectados: ', data);
        data.forEach(element => {
          this.addToChat(element);
        });

        this.socketId = data.id;
        observer.next(data);
      });
    });
  }

  getDisconnected() {
    // Escuchar eventos de 'mensajePrivado' del servidor
    this.socket.disconnect();

  }

  connect() {
    this.socket.connect();
  }


}
