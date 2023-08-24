import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { analytics } from '../dashboard.data';
import { GenericService } from 'src/app/share/generic.service';
import { UserService } from 'src/app/share/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit {

  public analytics: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Year';
  public showYAxisLabel = false;
  public yAxisLabel = 'Profit';
  public colorScheme: any = {
    domain: ['#283593', '#039BE5', '#FF5252']
  }; 
  public autoScale = true;
  public roundDomains = true;
  @ViewChild('resizedDiv') resizedDiv:ElementRef;
  public previousWidthOfResizedDiv:number = 0; 
  isAutenticated: boolean;
  currentUser: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(    private gService: GenericService, private userService: UserService) { 
    this.userService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al boolean que indica si esta autenticado
    this.userService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
  }

  ngOnInit() {
  }
  
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  onSelect(event) {
  }

  ngAfterViewChecked() {    
    // if(this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth){
    //   this.analytics = [...analytics];
    // }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}