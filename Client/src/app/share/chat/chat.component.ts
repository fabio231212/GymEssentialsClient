import { Component, Input } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';
import { UserChat, UserChatService } from '../chat.Service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @Input('idVendedor') idVendedor: number;
  // socket: Socket;
  // socketId: string;

  constructor(
    private userService: UserService,
    private chatService: UserChatService
  ) {
    this.chatService.currentDataUserChat$.subscribe((data) => {});
    this.userService.currentUser.subscribe((data) => {});
  }

  ngOnInit() {
    this.chatService.getMessage().subscribe((data) => {
      console.log(data);
    });
    this.chatService.getNoti().subscribe((data) => {
      console.log('Mensaje Enviado' + data);
    });

    //let user = this.userService.currentUserValue;

    // this.socket = io('http://localhost:8000');
    // this.socket.on('connect', () => {
    //   console.log('Conectado al servidor');
    //   // Separar el objeto de datos del callback y pasarlos como argumentos separados
    //   this.socket.emit('entrarChat', user, (resp: any) => {
    //     console.log('Usuarios conectados', resp);
    //   });
    //   // Escuchar eventos de 'mensajePrivado' del servidor
    //   this.socket.on('mensajePrivado', (data: any) => {
    //     console.log('Mensaje recibido:', data);
    //     this.chatService.addToChat(data);
    //     this.socketId = data.id;
    //   });
    // });
  }

  sendMessage() {
    // if (this.chatService.getItems != null) {
    //   this.socket.emit(
    //     'mensajePrivado',
    //     { para: this.socketId, mensaje: 'hola' },
    //     (resp: any) => {
    //       // console.log('respuesta server:', resp);
    //     }
    //   );
    // } else {
    //   this.socket.emit(
    //     'mensajePrivado',
    //     { para: this.idVendedor, mensaje: 'hola' },
    //     (resp: any) => {
    //       // console.log('respuesta server:', resp);
    //     }
    //   );
    // }
    this.chatService.sendMessage(this.idVendedor, 'hola');
  }

  ngonDestroy() {
    this.chatService.getDisconnected().subscribe((data) => {
      console.log(data);
    });
  }
  // this.socket.on('mensajePrivado', function () {
  //   // console.log('Conectado al servidor');

  //   this.socket.emit(
  //     'mensajePrivado',
  //     { usuario: 'fernando' },
  //     function (resp) {
  //       console.log('Usuarios conectados', resp);
  //     }
  //   );
  // });

  // this.socket.on('disconnect', function () {
  //   console.log('Perdimos conexión con el servidor');
  // });

  // ngOnInit() {
  //   // this.socket = io('http://localhost:8000'); // Reemplaza con la URL de tu servidor Socket.IO
  //   // let paras = new URLSearchParams(window.location.search);
  //   // // this.socket.on('entrarChat', (data: string) => {
  //   // //   this.messages.push(data);
  //   // // });
  //   // this.socket.on('connect', () => {
  //   //   console.log('Conectado al servidor');
  //   //   this.socket.emit('entrarChat', { usuario: 'fernando' });
  //   // });
  //   // this.sendMessage();
  // }
  // sendMessage() {
  //   this.socket.emit('entrarChat', this.message);
  //   this.message = '';
  // }
}
