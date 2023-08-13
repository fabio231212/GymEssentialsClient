import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserChatService } from './chat.Service';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class SocketGuard implements CanActivate {
  constructor(private chatService: UserChatService, private userService: UserService, private router: Router) { }

  canActivate(): boolean {
    // Verifica si el usuario está logueado y si tiene el rol de "Vendedor"
    const currentUser = this.userService.currentUserValue;
    if (currentUser && currentUser.roles.includes('Vendedor')) {
      // Inicializa el socket si aún no ha sido inicializado
      this.chatService.initializeSocket();
    }
    return true; // Permite la navegación a la ruta
  }
}
