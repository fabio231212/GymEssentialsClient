import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-direccion',
  templateUrl: './dialog-direccion.component.html',
  styleUrls: ['./dialog-direccion.component.scss']
})
export class DialogDireccionComponent {
  direcciones: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogDireccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) {
    this.direcciones = data;
  }

  onGuardarSeleccion(direccionSeleccionada: any) {
    if (direccionSeleccionada) {
      this.dialogRef.close(direccionSeleccionada);
    }
  }
}
