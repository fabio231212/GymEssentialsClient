import { AfterViewInit, Component, ViewChild,OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings, Settings } from '../../app.settings';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsuariosComponent implements OnInit {
  public usuarios: any;
  public searchText: string;
  public page:any;
  public settings: Settings;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public appSettings: AppSettings,
    public dialog: MatDialog,
    private router: Router,
    private gService: GenericService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.listaUsuarios();
  }

 async listaUsuarios() {
    this.gService
      .list('usuarios/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.usuarios = data;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  async updateHabilitado(idUsuario: number, habilitado: boolean) {
    const data = { id: idUsuario, habilitado: habilitado };
    this.gService
      .update('usuarios/', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.listaUsuarios();
      });
  }

  public onPageChanged(event) {
    this.page = event;
    this.listaUsuarios();
    window.scrollTo(0, 0);
  }

  // public openUserDialog(user: any) {
  //   let dialogRef = this.dialog.open(UserDialogComponent, {
  //     data: user,
  //   });
  //   // dialogRef.afterClosed().subscribe((user: User) => {
  //   //   if (user) {
  //   //     user.id ? this.updateUser(user) : this.addUser(user);
  //   //   }
  //   // });
  // }
}
