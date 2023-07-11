// PAGES
import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { Category } from '../../app.models';
import { SidenavMenuService } from '../sidenav-menu/sidenav-menu.service';
import { isPlatformBrowser } from '@angular/common';

// TOP MENU
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  providers: [SidenavMenuService],
})
export class TopMenuComponent implements OnInit {
  // PAGES
  public showBackToTop: boolean = false;
  // public categories: Category[];
  public category: Category;
  public sidenavMenuItems: Array<any>;
  @ViewChild('sidenav', { static: true }) sidenav: any;

  // TOP MENU
  public currencies = ['USD', 'EUR'];
  public currency: any;

  public settings: Settings;
  constructor(
    public appSettings: AppSettings,
    public appService: AppService,
    // public translateService: TranslateService,
    public sidenavMenuService: SidenavMenuService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    // PAGES
    // this.getCategories();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();

    // TOP MENU
    this.currency = this.currencies[0];
  }

  // TOP MENU
  public changeCurrency(currency) {
    this.currency = currency;
  }

  // public changeLang(lang: string) {
  //   this.translateService.use(lang);
  // }

  public getLangText(lang) {
    if (lang == 'de') {
      return 'German';
    } else if (lang == 'fr') {
      return 'French';
    } else if (lang == 'ru') {
      return 'Russian';
    } else if (lang == 'tr') {
      return 'Turkish';
    } else {
      return 'English';
    }
  }

  // PAGES
  // public getCategories() {
  //   this.appService.getCategories().subscribe((data) => {
  //     this.categories = data;
  //     this.category = data[0];
  //     this.appService.Data.categories = data;
  //   });
  // }

  // public changeCategory(event) {
  //   if (event.target) {
  //     this.category = this.categories.filter(
  //       (category) => category.name == event.target.innerText
  //     )[0];
  //   }
  //   if (window.innerWidth < 960) {
  //     this.stopClickPropagate(event);
  //   }
  // }

  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.appService.Data.totalPrice =
        this.appService.Data.totalPrice - product.newPrice * product.cartCount;
      this.appService.Data.totalCartCount =
        this.appService.Data.totalCartCount - product.cartCount;
      this.appService.resetProductCartCount(product);
    }
  }

  public clear() {
    this.appService.Data.cartList.forEach((product) => {
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }

  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public search() {}

  public scrollToTop() {
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset / (scrollDuration / 20);
    var scrollInterval = setInterval(() => {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const scrollTop = Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    let header_toolbar = document.getElementById('header-toolbar');
    if (header_toolbar) {
      if (scrollTop >= header_toolbar.clientHeight) {
        this.settings.mainToolbarFixed = true;
      } else {
        if (
          !document.documentElement.classList.contains('cdk-global-scrollblock')
        ) {
          this.settings.mainToolbarFixed = false;
        }
      }
    } else {
      this.settings.mainToolbarFixed = true;
    }
    $event.target.documentElement.scrollTop > 300
      ? (this.showBackToTop = true)
      : (this.showBackToTop = false);
  }

  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.sidenavMenuService.expandActiveSubMenu(
      this.sidenavMenuService.getSidenavMenuItems()
    );
  }

  public closeSubMenus() {
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }
}
