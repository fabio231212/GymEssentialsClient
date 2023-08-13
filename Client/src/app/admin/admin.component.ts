import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AppSettings, Settings } from '../app.settings';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './components/menu/menu.service';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  public userImage = 'assets/images/others/admin.jpg';
  public settings: Settings;
  public menuItems: Array<any>;
  public toggleSearchBar: boolean = false;
  isAutenticated: boolean;
  currentUser: any;
  constructor(public appSettings: AppSettings,
    public router: Router,
    private menuService: MenuService,
    private authService: UserService,) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if (window.innerWidth <= 960) {
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false;
    };
    setTimeout(() => {
      this.settings.theme = 'red';
    });
    this.menuItems = this.menuService.getMenuItems();

        //Subscripción a la información del usuario actual
        this.authService.currentUser.subscribe((x) => (this.currentUser = x));
        //Subscripción al boolean que indica si esta autenticado
        this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
  }

  ngAfterViewInit() {
    if (document.getElementById('preloader')) {
      document.getElementById('preloader').classList.add('hide');
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      }
      if (window.innerWidth <= 960) {
        this.sidenav.close();
      }
    });
    this.menuService.expandActiveSubMenu(this.menuService.getMenuItems());
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }

  public scrollToTop() {
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset / (scrollDuration / 20);
    var scrollInterval = setInterval(() => {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, scrollStep);
      }
      else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 960) {
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false;
    }
    else {
      this.settings.adminSidenavIsOpened = true;
      this.settings.adminSidenavIsPinned = true;
    }
  }

}
