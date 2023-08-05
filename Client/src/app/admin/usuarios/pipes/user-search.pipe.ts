import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UserSearchPipe', pure: false })
export class UserSearchPipe implements PipeTransform {
  transform(value: any[], args?: any): any {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(user => {
        if (user.nombre) {
          return user.nombre.search(searchText) !== -1;
        }
        else{
          return user.apellidos.search(searchText) !== -1;
        }
      });
    }
  }
}