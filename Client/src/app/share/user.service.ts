import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { AuthGuard, DecodedToken } from './auth.guard';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

export class User {
  constructor(
    public userId: number,
    public nombre: string,
    public email: string,
    public roles: string[] // public token: string
  ) {}
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  ServerUrl = environment.apiURL;
  private userSubject = new BehaviorSubject<User>(null);
  public currentUser = this.userSubject.asObservable();
  private auth: AuthGuard;
  private authenticated = new BehaviorSubject<boolean>(false);
  private gService: GenericService;

  constructor(private http: HttpClient) {
    let decodedToken = this.getDecodedToken(localStorage.getItem('token'));
    this.userSubject = new BehaviorSubject<User>(decodedToken);
    this.currentUser = this.userSubject.asObservable();
  }

  // setUser(token: string) {
  //   let decodedToken = this.getDecodedToken(token);
  //   this.user = new BehaviorSubject<User>(decodedToken);
  //   this.currentUser$ = this.user.asObservable();
  //   console.log('setUser', this.user.value);
  // }

  get currentUserValue(): User {
    return this.userSubject.getValue();
  }

  get isAuthenticated() {
    if (this.currentUserValue != null) {
      this.authenticated.next(true);
    } else {
      this.authenticated.next(false);
    }
    return this.authenticated.asObservable();
  }

  getDecodedToken(token: string): DecodedToken {
    try {
      const tokenData = jwt_decode(token) as DecodedToken;
      return tokenData;
    } catch (error) {
      return null;
    }
  }

  //Crear usuario
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.ServerUrl + 'usuarios/', user);
  }

  //Login
  loginUser(user: any): Observable<any> {
    return this.http.post<any>(this.ServerUrl + 'usuarios/login', user).pipe(
      map((user) => {
        // almacene los detalles del usuario y el token jwt
        // en el almacenamiento local para mantener al usuario conectado entre las actualizaciones de la página

        localStorage.setItem('token', user.token);
        this.authenticated.next(true);
        this.userSubject.next(this.getDecodedToken(JSON.stringify(user)));
        this.userSubject.getValue
        return user;
      })
    );
  }



  //Logout de usuario autentificado
  logout() {
    let usuario = this.userSubject.value;
    if (usuario) {
      // eliminar usuario del almacenamiento local para cerrar la sesión del usuario
      localStorage.removeItem('token');
      //Eliminarlo del observable del usuario actual
      this.userSubject.next(null);
      //Eliminarlo del observable del boleano si esta autenticado
      this.authenticated.next(false);
      return true;
    }
    return false;
  }
}
