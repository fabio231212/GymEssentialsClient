import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserChatService } from '../../share/chat.Service';
import { UserService } from '../../share/user.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.scss']
})
export class ChatAdminComponent {
  message: string;
  messages = [];
  user: any;
  @ViewChild('messageDiv', { static: false }) messageDiv: ElementRef;
  constructor(
    private userService: UserService,
    private chatService: UserChatService,
    private dialogRef: MatDialogRef<ChatAdminComponent>
  ) {
    this.chatService.currentDataUserChat$.subscribe((data) => { });
    this.userService.currentUser.subscribe((data) => {
      this.user = data;
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    if (this.user) {
      this.chatService.getMessage().subscribe((data) => {
        console.log(data);
        this.messages.push(data);
      });
      this.chatService.getListaPersonas().subscribe((data) => {
        console.log(data);
      });

    }
  }
  sendMessage() {
    const idSocket = this.messageDiv.nativeElement.getAttribute('idSocket');
    this.chatService.sendMessage(idSocket, this.message);
  }
}
