import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserChatService } from '../../share/chat.Service';
import { UserService } from '../../share/user.service';

@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
})
export class ChatAdminComponent {
  message: string;
  messages = [];
  user: any;
  @ViewChild('messageDiv', { static: false }) messageDiv: ElementRef;
  constructor(
    private userService: UserService,
    private chatService: UserChatService
  ) {
    this.chatService.currentDataUserChat$.subscribe((data) => {});
    this.userService.currentUser$.subscribe((data) => {
      this.user = data;
    });
  }

  ngOnInit(): void {
    this.chatService.getMessage().subscribe((data) => {
      console.log(data);
      this.messages.push(data);
    });
  }
  sendMessage() {
    const idSocket = this.messageDiv.nativeElement.getAttribute('idSocket');
    this.chatService.sendMessage(idSocket, this.message);
  }
}
