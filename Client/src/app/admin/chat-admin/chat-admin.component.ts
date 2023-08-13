import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Message, UserChatService } from '../../share/chat.Service';
import { UserService } from '../../share/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

interface UniqueUser {
  id: string;
  name: string;
  messageCount: number;
  lastMessageTime?: string;
}
@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.scss'],
})
export class ChatAdminComponent {
  @Input() messages: any[];
  usuarios: any[];
  selectedUserId: number;
  combinedMessages: Message[];
  message: string;
  user: any;
  @ViewChild('messageDiv', { static: false }) messageDiv: ElementRef;
  constructor(
    private userService: UserService,
    private chatService: UserChatService,
    private dialogRef: MatDialogRef<ChatAdminComponent>
  ) {
    this.userService.currentUser.subscribe((data) => {
      this.user = data;
    });
    if (userService.currentUserValue != null && this.user.roles.includes('Vendedor')) {
      this.chatService.currentDataUserChat$.subscribe((data) => { });
    }

  }
  showMessages(id: number) {
    this.selectedUserId = id;
    this.usuarios.forEach(x => {
      if (x.id == id) {
        x.messageCount = 0;
      }
    });
    const userMessages = this.messages.filter(message => message.id === id);
    this.combinedMessages = userMessages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getUniqueUsers() {
    if (this.messages) {
      const uniqueUsersMap = new Map<string, UniqueUser>();

      this.messages.forEach(message => {
        const id = message.id;
        const name = message.from;
        const date = new Date(message.date);

        if (uniqueUsersMap.has(id)) {
          // Si el usuario ya existe en el mapa, aumenta la cantidad de mensajes en 1.
          const user = uniqueUsersMap.get(id);
          if (!message.isSended) {
            user.messageCount++;
          }

          // Actualiza la hora del mensaje más reciente si es más tarde que la actual.
          if (!user.lastMessageTime || date > new Date('1970-01-01T' + user.lastMessageTime + 'Z')) {
            user.lastMessageTime = date.toTimeString().slice(0, 5); // Obtenemos solo la hora en formato HH:mm.
          }

          uniqueUsersMap.set(id, user);
        } else {
          // Si el usuario no existe en el mapa, crea una nueva entrada con el usuario, la cantidad de mensajes igual a 1 y la hora del mensaje más reciente.
          const lastMessageTime = date.toTimeString().slice(0, 5); // Obtenemos solo la hora en formato HH:mm.
          uniqueUsersMap.set(id, { id, name, messageCount: 1, lastMessageTime });
        }
      });

      const uniqueUsers = Array.from(uniqueUsersMap.values());
      this.usuarios = uniqueUsers;
      console.log(this.usuarios)
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    if (this.user && this.user.roles.includes('Vendedor')) {
      this.messages = this.chatService.getMessages;
      this.getUniqueUsers();
      this.chatService.getMessage().subscribe((data) => {
        this.messages = this.chatService.getMessages;
        this.getUniqueUsers();
        if (this.selectedUserId > 0) {
          this.showMessages(this.selectedUserId)
        }
      });
    }
    console.log(this.chatService.getMessages)
  }
  sendMessage() {
    if (this.message === '') return;

    this.chatService.sendMessage(this.selectedUserId, this.message);
    this.chatService.addMessage({
      id: this.selectedUserId,
      idSocket: this.user.id,
      from: this.user.nombre,
      message: this.message,
      date: new Date(),
      isSended: true,
    })
    this.message = '';
    this.messages = this.chatService.getMessages;
    this.showMessages(this.selectedUserId)
  }
}
