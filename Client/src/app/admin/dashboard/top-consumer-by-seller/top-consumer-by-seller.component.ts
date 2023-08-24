import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-top-consumer-by-seller',
  templateUrl: './top-consumer-by-seller.component.html',
  styleUrls: ['./top-consumer-by-seller.component.scss'],
})
export class TopConsumerBySellerComponent implements OnInit {
  public data: any[];
  public compradoresConMasCompras: any[];
  public showLegend = false;
  public gradient = true;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public colorScheme: any = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B'],
  };
  public showLabels = true;
  public explodeSlices = true;
  public doughnut = false;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  isAutenticated: boolean;
  currentUser: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private datePipe: DatePipe,
    private userService: UserService
  ) {
    this.userService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al boolean que indica si esta autenticado
    this.userService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

  ngOnInit() {
    this.getTop5();
  }
  getTop5() {
    this.gService
      .get('usuarios/compradorConMasComprasXVendedor', this.currentUser.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {;
        this.data = data;
        this.compradoresConMasCompras = [...this.data]; // Assign here if needed immediately
      });
  }
  public onSelect(event) {
  }

  ngAfterViewChecked() {
    if (this.resizedDiv) {
      if (
        this.previousWidthOfResizedDiv !=
        this.resizedDiv.nativeElement.clientWidth
      ) {
        if (this.data) {
          this.compradoresConMasCompras = [...this.data];
        }
      }
      this.previousWidthOfResizedDiv =
        this.resizedDiv.nativeElement.clientWidth;
    }
  }
}
