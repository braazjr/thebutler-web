import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../models/usuario-model';

import * as lodash from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor() { }

  isAdmin() {
    if (localStorage.getItem('token') !== null) {
      const permissoes: any[] = this.jwtHelper.decodeToken(localStorage.getItem('token')).authorities;
      return permissoes.includes('ADMIN');
    }
  }

  getUsuarioLogged() {
    if (localStorage.getItem('token') !== null) {
      const usuario: Usuario = this.jwtHelper.decodeToken(localStorage.getItem('token')).usuario;
      if (usuario.empresa) {
        usuario.empresa.dataHoraCadastro = undefined;
        usuario.empresa.dataHoraModificacao = undefined;
      }
      return usuario;
    }
  }

  checkRole(roles) {
    if (localStorage.getItem('token') !== null) {
      const permissoes: any[] = this.jwtHelper.decodeToken(localStorage.getItem('token')).authorities;
      return !roles || lodash.intersection(permissoes, roles).length > 0;
    }

    return false;
  }
}
