import { orders, products, customers, refunds } from '../dashboard.data';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/share/user.service';
@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit {
  public worstSellers: any[];
  public top5Users: any[];
  public customers: any[];
  public refunds: any[];
  datosTopSellers: any[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  public colorScheme: any = {
    domain: ['rgba(255,255,255,0.8)']
  };
  public autoScale = true;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe, private userService: UserService) { }

  ngOnInit() {
    this.customers = customers;
    this.getTop5();
    this.getWorstSellers();
    this.refunds = refunds;
    // this.worstSellers = this.addRandomValue('orders');
    // this.customers = this.addRandomValue('customers');

  }

  public onSelect(event) {
    console.log(event);
  }


  ngOnDestroy() {
    this.worstSellers[0].series.length = 0;
    this.customers[0].series.length = 0;
  }
  getTop5() {
    this.gService
      .list('usuarios/top5/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);

        this.top5Users = [...data]; // Assign here if needed immediately
      });
  }
  getWorstSellers() {
    this.gService
      .list('usuarios/top3Worst/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.worstSellers = [...data]; // Assign here if needed immediately
      });
  }
  ngAfterViewChecked() {
    // if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
    //   setTimeout(() => this.worstSellers = [...orders]);
    //   // if (this.datosTopSellers) {
    //   //   this.top5Users = [...this.datosTopSellers];
    //   // }
    //   // if (this.datosWorstSellers) {
    //   //   this.worstSellers = [...this.datosWorstSellers];
    //   // }
    //   setTimeout(() => this.customers = [...customers]);
    //   setTimeout(() => this.refunds = [...refunds]);
    // }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}
