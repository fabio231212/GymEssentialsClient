import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  private socket: Socket;
  public message: string = 'hola';
  public messages: string[] = [];
  constructor() {
    // this.socket = io('http://localhost:8000', {
    //   withCredentials: true,
    //   extraHeaders: {
    //     'my-custom-header': 'abcd',
    //   },
    // });
  }

  // ngOnInit() {
  //   this.socket = io('http://localhost:8000');
  //   // // Lógica de escucha y emisión de eventos del socket
  //   // this.socket.on('message', (data: any) => {
  //   //   console.log('Mensaje recibido:', data);
  //   // });
  //   // // Emitir un evento al servidor
  //   // this.socket.emit('chat', 'Hola servidor!');

  //   this.socket.on('connect', function () {
  //     console.log('Conectado al servidor');

  //     // this.socket.emit('entrarChat', function (usuario) {
  //     //   console.log('Usuarios conectados', usuario);
  //     // });
  //     this.socket.emit('entrarChat', { usuario: 'fernando' });
  //   });

  //   // this.socket.on('mensajePrivado', function () {
  //   //   // console.log('Conectado al servidor');

  //   //   this.socket.emit(
  //   //     'mensajePrivado',
  //   //     { usuario: 'fernando' },
  //   //     function (resp) {
  //   //       console.log('Usuarios conectados', resp);
  //   //     }
  //   //   );
  //   // });

  //   // this.socket.on('disconnect', function () {
  //   //   console.log('Perdimos conexión con el servidor');
  //   // });
  // }
  ngOnInit() {
    // this.socket = io('http://localhost:8000'); // Reemplaza con la URL de tu servidor Socket.IO
    // let paras = new URLSearchParams(window.location.search);
    // // this.socket.on('entrarChat', (data: string) => {
    // //   this.messages.push(data);
    // // });
    // this.socket.on('connect', () => {
    //   console.log('Conectado al servidor');
    //   this.socket.emit('entrarChat', { usuario: 'fernando' });
    // });
    // this.sendMessage();
  }
  // sendMessage() {
  //   this.socket.emit('entrarChat', this.message);
  //   this.message = '';
  // }
}
