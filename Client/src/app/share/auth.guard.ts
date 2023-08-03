// auth.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { UserService } from './user.service';

export interface DecodedToken {
  userId: number;
  nombre: string;
  email: string;
  roles: string[];
  // Otras propiedades que se esperan en el token JWT, si las hay
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');

    if (token) {
      // Verificar si el token es válido y decodificarlo
      try {
        const decodedToken = jwt_decode(token) as DecodedToken;

        // Verificar si el usuario tiene al menos uno de los roles necesarios para acceder a la ruta protegida
        const requiredRoles = route.data['roles'] as string[];
        const userRoles = decodedToken.roles;

        if (userRoles.some((role) => requiredRoles.includes(role))) {
          return true;
        }

        // Si el usuario no tiene los roles necesarios, redirigir al usuario a una página de acceso no autorizado
        this.router.navigate(['/unauthorized']);
        return false;
      } catch (error) {
        // Si hay un error al decodificar el token, redirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/usuario/login']), { queryParams: { auth: 'no' } };
        return false;
      }
    } else {
      // Redirigir al usuario a la página de inicio de sesión si no tiene el token
      this.router.navigate(['/usuario/login']),
        {
          queryParams: { auth: 'no' },
        };
      return false;
    }
  }
}
//   isAuthenticated: boolean;
//   currentUser: any;
//   constructor(private userService: UserService, private router: Router) {
//     //Subscribirse para obtener si esta autenticado
//     this.userService.isAuthenticated.subscribe(
//       (valor) => (this.isAuthenticated = valor)
//     );
//     //Subscribirse para obtener el usuario autenticado
//     this.userService.currentUser.subscribe((x) => (this.currentUser = x));
//   }
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     let url: string = state.url;
//     return this.checkUserLogin(route, url);
//   }
//   //Verificar que el rol del usuario coincida
//   //con alguno de los indicados
//   checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
//     if (this.isAuthenticated) {
//       const userRole = this.currentUser.user.role;
//       //roles.length && roles.indexOf(verify.role)===-1
//       if (
//         route.data['roles'].length &&
//         !route.data['roles'].includes(userRole)
//       ) {
//         this.router.navigate(['/login'], {
//           //Parametro para mostrar mensaje en login
//           queryParams: { auth: 'no' },
//         });
//         return false;
//       }
//       return true;
//     }

//     this.router.navigate(['/login'], {
//       queryParams: { auth: 'no' },
//     });
//     return false;
//   }
// }
