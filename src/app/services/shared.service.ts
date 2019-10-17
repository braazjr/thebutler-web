import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario-model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class SharedService {

  usuario: Usuario;
  permissoes: any[];
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor() { }

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

  isAdmin() {
    if (localStorage.getItem('token') !== null) {
      const permissoes: any[] = this.jwtHelper.decodeToken(localStorage.getItem('token')).permissoes;
      return permissoes.includes('ADMIN');
    }
  }

  isOperador() {
    if (localStorage.getItem('token') !== null) {
      const permissoes: any[] = this.jwtHelper.decodeToken(localStorage.getItem('token')).permissoes;
      return permissoes.includes('OPERADOR');
    }
  }

  checkRole(role) {
    if (localStorage.getItem('token') !== null) {
      const permissoes: any[] = this.jwtHelper.decodeToken(localStorage.getItem('token')).permissoes;
      return permissoes.includes(role);
    }
  }
}
