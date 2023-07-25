import { Component, Input } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @Input('idVendedor') idVendedor: number;
  userData: any = JSON.parse(localStorage.getItem('user'));
  socket: Socket;
  constructor(private userService: UserService) {
    userService.currentUser$.subscribe((user) => {});
  }

  ngOnInit() {
    let user = this.userService.currentUserValue;
    this.socket = io('http://localhost:8000');

    this.socket.on('connect', () => {
      console.log('Conectado al servidor');

      // Separar el objeto de datos del callback y pasarlos como argumentos separados

      this.socket.emit('entrarChat', user, (resp: any) => {
        console.log('Usuarios conectados', resp);
      });
      // Escuchar eventos de 'mensajePrivado' del servidor
      this.socket.on('mensajePrivado', (data: any) => {
        console.log('Mensaje recibido:', data);
      });
    });
  }

  sendMessage() {
    if(this.idVendedor < 0){
      
    }
    this.socket.emit(
      'mensajePrivado',
      { para: this.idVendedor, mensaje: 'hola' },
      (resp: any) => {
        // console.log('respuesta server:', resp);
      }
    );
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
