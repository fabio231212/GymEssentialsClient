import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/share/user.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  isAutenticated: boolean;
  currentUser: any;
  public userImage = 'assets/images/others/admin.jpg';
  constructor( private authService: UserService,    public router: Router) { }

  ngOnInit(): void {
    
        //Subscripción a la información del usuario actual
        this.authService.currentUser.subscribe((x) => (this.currentUser = x));
        //Subscripción al boolean que indica si esta autenticado
        this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
  }

  public logout() {
    this.router.navigate(['/']);
    this.authService.logout();
    // this.router.navigate(['/login']);
  }

}
