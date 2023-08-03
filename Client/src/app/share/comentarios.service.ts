import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthGuard, DecodedToken } from './auth.guard';
import jwt_decode from 'jwt-decode';

export interface Comentario {
  id: number;
  calificacion: number;
  comentario: string;
  productoId: number;
  usuarioId: number | null; // Puedes usar `null` para representar comentarios anónimos
  fecha: Date;
  usuario: any;
}

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private comentariosSubject: BehaviorSubject<Comentario[]> = new BehaviorSubject<Comentario[]>([]);
  public comentarios$: Observable<Comentario[]> = this.comentariosSubject.asObservable();

  constructor() {}

  // Función para agregar un nuevo comentario a la lista y notificar a los suscriptores
  agregarComentario(comentario: Comentario) {
    const comentarios = this.comentariosSubject.getValue();
    comentarios.push(comentario);
    this.comentariosSubject.next(comentarios);
  }
}
