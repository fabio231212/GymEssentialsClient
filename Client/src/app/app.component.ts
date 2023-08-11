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
  user: any;
  showButtonMessage: boolean = true;
  constructor(public appSettings: AppSettings,
    public router: Router, public dialog: MatDialog, private userService: UserService,
    private chatService: UserChatService,
    @Inject(PLATFORM_ID) private platformId: Object) {

    this.settings = this.appSettings.settings;
    this.userService.currentUser.subscribe((data) => {
      this.user = data;
    });



  }


  ngOnInit() {
    // if (this.userService.currentUserValue != null && this.user.roles.includes('Vendedor')) {
    //this.chatService.connect();
    this.chatService.currentDataUserChat$.subscribe((data) => { });
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
    // } else {
    //   this.showButtonMessage = false;
    // }
  }
  openChatDialog() {
    this.showButtonMessage = false;
    const dialogRef = this.dialog.open(ChatAdminComponent, {
      width: '2000px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.showButtonMessage = true; // Restablecer la variable al cerrar el diálogo
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
