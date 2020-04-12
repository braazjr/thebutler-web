import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastService } from '../services/toast.service';
import { DefaultService } from '../services/default.service';

import * as lodash from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private toastService: ToastService,
    private defaultService: DefaultService
  ) { }

  isAdmin() {
    if (localStorage.getItem('token') !== null) {
      const permissoes: any[] = this.getUsuarioLogged().permissoes;
      return permissoes.includes('ADMIN');
    }
  }

  getUsuarioLogged() {
    if (localStorage.getItem('token') !== null) {
      const usuario = this.jwtHelper.decodeToken(localStorage.getItem('token')).usuario;
      // this.defaultService.getById('empresas', usuario.empresa.id)
      //   .subscribe(data => console.log(data))
      // if (usuario.empresa) {
      //   usuario.empresa.dataHoraCadastro = undefined;
      //   usuario.empresa.dataHoraModificacao = undefined;
      // }
      return usuario;
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
