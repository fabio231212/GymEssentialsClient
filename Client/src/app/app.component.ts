import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './share/products-carousel/product-dialog/product-dialog.component';
import { ChatAdminComponent } from './admin/chat-admin/chat-admin.component';
import { UserService } from './share/user.service';
import { Message, UserChatService } from './share/chat.Service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: boolean = false;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
    public router: Router, public dialog: MatDialog, private userService: UserService,
    private chatService: UserChatService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.settings = this.appSettings.settings;
    this.userService.currentUser.subscribe((data) => { });
    this.chatService.currentDataUserChat$.subscribe((data) => { });
  }

  ngOnInit() {
    if (this.userService.currentUserValue != null) {
      // this.router.navigate(['']);  //redirect other pages to homepage on browser refresh
      this.chatService.getMessage().subscribe((data) => {
        const dateParsed = new Date(data.fecha);
        const message = {
          id: data.idUser,
          idSocket: data.id,
          from: data.nombre,
          message: data.mensaje,
          date: dateParsed,
          isSended: false,
        }
        this.chatService.addMessage(message);
      });
      this.chatService.getListaPersonas().subscribe((data) => {
        console.log(data);
      });
    }
  }
  openChatDialog() {
    this.dialog.open(ChatAdminComponent, {
      width: '2000px', // Puedes ajustar el tamaño del diálogo aquí
    });
  }


  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      }
    })
  }
}
