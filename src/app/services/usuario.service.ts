import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  getUsuarioPorEmpresa(pageable, ) {
    return this.http.get(`${environment.urlSpring}/usuarios`, { withCredentials: true, params: pageable });
  }

  redefinirSenha(idUsuario: number, senhaAtual: string, senhaNova: string) {
    return this.http.patch(
      `${environment.urlSpring}/usuarios/${idUsuario}/redefinir-senha`,
      { senhaAtual: senhaAtual, senhaNova: senhaNova },
      { withCredentials: true }
    );
  }
}
