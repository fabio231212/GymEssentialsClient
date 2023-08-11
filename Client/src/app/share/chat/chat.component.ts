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
  showChatBox: boolean = true;
  mensaje: string;
  messages: { timestamp: string; sender: string; content: string, isSended: boolean }[] = [];


  constructor(
    private userService: UserService,
    private chatService: UserChatService
  ) {

    this.userService.currentUser.subscribe((data) => { });

    if (userService.currentUserValue != null) {
      this.chatService.currentDataUserChat$.subscribe((data) => { });

    }


  }

  ngOnInit() {
    if (this.userService.currentUserValue != null) {
     this.chatService.initializeSocket();
      this.chatService.getMessage().subscribe((data) => {
        const dateParsed = new Date(data.fecha);
        this.createMessage(data.mensaje, data.nombre, dateParsed.toLocaleTimeString(), false)
        console.log('Mensaje Recibido' + data);
      });
      this.chatService.getListaPersonas().subscribe((data) => {
        console.log('Usuarios conectados' + data);
      });

    }

  }

  toggleChat() {
    this.showChatBox = !this.showChatBox; // Cambia el valor de la variable (mostrar/ocultar)
  }

  sendMessage() {

    if (this.mensaje.trim() !== '') {
    }
    this.chatService.sendMessage(this.idVendedor, this.mensaje);
    this.createMessage(this.mensaje, 'Usted', new Date().toLocaleTimeString(), true);
  }

  createMessage(content: string, sender: string, timestamp: string, isSended: boolean) {

    this.messages.push({ timestamp, sender, content, isSended });
    this.mensaje = '';
  }

  ngOnDestroy() {

    this.chatService.getDisconnected();
  }

}
