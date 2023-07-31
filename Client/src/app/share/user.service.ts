import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthGuard, DecodedToken } from './auth.guard';
import jwt_decode from 'jwt-decode';

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
  private user = new BehaviorSubject<User>(null);
  public currentUser$ = this.user.asObservable();
  private auth: AuthGuard;

  constructor() {
    let decodedToken = this.getDecodedToken(localStorage.getItem('token'));
    this.user = new BehaviorSubject<User>(decodedToken);
    this.currentUser$ = this.user.asObservable();
  }

  // setUser(token: string) {
  //   let decodedToken = this.getDecodedToken(token);
  //   this.user = new BehaviorSubject<User>(decodedToken);
  //   this.currentUser$ = this.user.asObservable();
  //   console.log('setUser', this.user.value);
  // }

  get currentUserValue(): User {
    return this.user.getValue();
  }

  getDecodedToken(token: string): DecodedToken {
    try {
      const tokenData = jwt_decode(token) as DecodedToken;
      return tokenData;
    } catch (error) {
      return null;
    }
  }
}
