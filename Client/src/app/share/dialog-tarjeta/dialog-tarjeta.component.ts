import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-tarjeta',
  templateUrl: './dialog-tarjeta.component.html',
  styleUrls: ['./dialog-tarjeta.component.scss']
})
export class DialogTarjetaComponent {
  tarjetas: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogTarjetaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) {
    this.tarjetas = data;
  }

  onGuardarSeleccion(tarjetaSeleccionada: any) {
    if (tarjetaSeleccionada) {
      this.dialogRef.close(tarjetaSeleccionada);
    }
  }
}
