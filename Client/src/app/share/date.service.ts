import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthGuard, DecodedToken } from './auth.guard';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class DateService {

  constructor() {}

//Un metodo get month pero con los nombres en español
public getMonths(){
  return [
      { value: '01', name: 'Enero' },
      { value: '02', name: 'Febrero' },
      { value: '03', name: 'Marzo' },
      { value: '04', name: 'Abril' },
      { value: '05', name: 'Mayo' },
      { value: '06', name: 'Junio' },
      { value: '07', name: 'Julio' },
      { value: '08', name: 'Agosto' },
      { value: '09', name: 'Septiembre' },
      { value: '10', name: 'Octubre' },
      { value: '11', name: 'Noviembre' },
      { value: '12', name: 'Diciembre' }
  ]
}

public getYears(){
  let years = [];
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + 10; // Puedes ajustar este valor según tus necesidades

  for (let year = currentYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
}

}
