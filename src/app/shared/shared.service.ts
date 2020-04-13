import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import * as lodash from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor() { }

  isAdmin() {
    if (localStorage.getItem('token') !== null) {
      const permissoes: any[] = this.getUsuarioLogged().permissoes;
      return permissoes.includes('ADMIN');
    }
  }

  getUsuarioLogged() {
    if (localStorage.getItem('token') !== null) {
      return this.jwtHelper.decodeToken(localStorage.getItem('token')).usuario;
    }
  }

  checkRole(roles) {
    if (localStorage.getItem('token') !== null) {
      const permissoes: any[] = this.getUsuarioLogged().permissoes;
      return !roles || lodash.intersection(permissoes, roles).length > 0;
    }

    return false;
  }
}
