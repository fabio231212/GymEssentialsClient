import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isAutenticated: boolean;
  currentUser: any;

  constructor(private userService: UserService) {
    this.userService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al boolean que indica si esta autenticado
    this.userService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
   }

  ngOnInit(): void {
  }

}
