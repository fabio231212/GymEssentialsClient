import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppSettings, Settings } from '../../../app.settings'; 
import { MenuService } from './menu.service';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class MenuComponent implements OnInit {
  isAutenticated: boolean;
  currentUser: any;
  public settings: Settings;
  showSubMenu: string | null = null;
  constructor(public appSettings:AppSettings, private authService: UserService) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() { 
            //Subscripción a la información del usuario actual
            this.authService.currentUser.subscribe((x) => (this.currentUser = x));
            //Subscripción al boolean que indica si esta autenticado
            this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));    
  }


  public toggleSubMenu(menuName: string, subMenuName: string){
    let menuItem = document.getElementById(menuName);
    let subMenu = document.getElementById(subMenuName);
    if(subMenu){
      if(subMenu.classList.contains('show')){
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else{
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }      
    }
  }

}
