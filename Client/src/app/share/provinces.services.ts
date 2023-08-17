import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  constructor(private http: HttpClient) { }

  // https://web.archive.org/web/20230330004601/https://programando.paginasweb.cr/2016/04/29/lista-de-provincias-cantones-y-distritos-de-costa-rica-en-formato-json/

 async getProvinces(): Promise<any> {
    const url = 'https://ubicaciones.paginasweb.cr/provincias.json';



    return this.http.get(url)
      .pipe(
        catchError(error => {
          console.error('Error fetching provinces:', error);
          return throwError('An error occurred while fetching provinces.');
        })
      )
      .toPromise();
  }

 async getCantons(province: string): Promise<any> {
    try {
      const url = `https://ubicaciones.paginasweb.cr/provincia/${province}/cantones.json`;
      return this.http.get(url).toPromise();
    } catch (error) {
      return error;
    }
  }

 async getDistritos(province: string, canton: string): Promise<any> {
    try {
      const url = `https://ubicaciones.paginasweb.cr/provincia/${province}/canton/${canton}/distritos.json`;
      return this.http.get(url).toPromise();
    } catch (error) {
      return error;
    }
  }
}
