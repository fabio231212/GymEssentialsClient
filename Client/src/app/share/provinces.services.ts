import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  constructor(private http: HttpClient) {}

  // https://web.archive.org/web/20230330004601/https://programando.paginasweb.cr/2016/04/29/lista-de-provincias-cantones-y-distritos-de-costa-rica-en-formato-json/

  getProvinces(): Promise<any> {
    try {
      const url = 'https://ubicaciones.paginasweb.cr/provincias.json';
      return this.http.get(url).toPromise();
    } catch (error) {
      return error;
    }
  }

  getCantons(province: string): Promise<any> {
    try {
      const url = `https://ubicaciones.paginasweb.cr/provincia/${province}/cantones.json`;
      return this.http.get(url).toPromise();
    } catch (error) {
      return error;
      console.log(error);
    }
  }

  getDistritos(province: string, canton: string): Promise<any> {
    try {
      const url = `https://ubicaciones.paginasweb.cr/provincia/${province}/canton/${canton}/distritos.json`;
      return this.http.get(url).toPromise();
    } catch (error) {
      return error;
    }
  }
}
