import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NotificacionService, TipoMessage } from './notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(    private noti: NotificacionService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isExternalApi = request.url.startsWith('https://ubicaciones.paginasweb.cr');
    const token = localStorage.getItem('token');

    if (token && !isExternalApi) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message: string = null;
        //Códigos de estado HTTP con su respectivo mensaje
        switch (error.status) {
          case 400:
            message = 'Solicitud incorrecta';
            break;
          case 401:
            message = 'No autorizado';
            break;
          case 403:
            message = 'Acceso denegado';
            break;
          case 422:
            message = 'Se ha presentado un error';
            break;
        }
        //Mostrar un mensaje de error
        this.noti.mensaje('Error', error.error.message,TipoMessage.error);
        return next.handle(request);
      })
      );
  }


}
