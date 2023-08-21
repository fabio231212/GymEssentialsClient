import { Component, Inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { UserService } from 'src/app/share/user.service';

@Component({
  selector: 'app-evaluacion-usuario',
  templateUrl: './evaluacion-usuario.component.html',
  styleUrls: ['./evaluacion-usuario.component.scss']
})
export class EvaluacionUsuarioComponent {
  calificacionSeleccionada: number = 0;
  comentarios: any[] = [];
  user: any;
  public form: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private activatedRoute: ActivatedRoute,
    public formBuilder: UntypedFormBuilder,
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService, private notiService: NotificacionService, private dialogRef: MatDialogRef<EvaluacionUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reactiveForm();

  }


  reactiveForm() {
    this.form = this.formBuilder.group({
      review: [null, [Validators.required, Validators.minLength(10)]],
    });

  }


  closeDialog() {
    this.dialogRef.close();
  }
  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  };

  ngOnInit() {
    this.userService.currentUser.subscribe((resp: any) => {
      this.user = resp;
    });

  }
  sendReview() {

    if (this.form.invalid) {
      return;
    }
    if (this.calificacionSeleccionada == 0) {
      this.notiService.mensaje('Evaluación', 'Seleccione una calificación', TipoMessage.warning);
      return;
    }
    const data = {
      comentario: this.form.value.review,
      calificacion: this.calificacionSeleccionada,
      usuarioId: this.data.id,
      isVendedor: this.data.isVendedor,
    }
    this.gService.create('evaluacionUsuario', data)
      .pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
        if (resp) {
          this.form.reset();
          this.calificacionSeleccionada = 0;
          this.notiService.mensaje('Evaluación', 'Evaluación enviada con éxito', TipoMessage.success);
          this.comentarios = resp;
          this.closeDialog();
        }
      });

  }


  onReset() {
    this.form.reset();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  getStars(cantidad: number): number[] {
    return Array.from({ length: cantidad });
  }

  seleccionarCalificacion(calificacion: number) {
    this.calificacionSeleccionada = calificacion;
  }
}
