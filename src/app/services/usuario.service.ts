import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class UsuarioService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  getUsuarioPorEmpresa(pageable, ) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/usuarios`, { headers: hds, withCredentials: true, params: pageable });
  }

  redefinirSenha(idUsuario: number, senhaAtual: string, senhaNova: string) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.patch(
      `${environment.urlSpring}/usuarios/${idUsuario}/redefinir-senha`,
      { senhaAtual: senhaAtual, senhaNova: senhaNova },
      { headers: hds, withCredentials: true }
    );
  }
}
