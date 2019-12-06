import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getUsuarioPorEmpresa(pageable, ) {
    return this.http.get(`${environment.urlSpring}/usuarios`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Carregando usuários!`);
          return Observable.throw(error);
        })
      );
  }

  redefinirSenha(idUsuario: number, senhaAtual: string, senhaNova: string) {
    return this.http.patch(`${environment.urlSpring}/usuarios/${idUsuario}/redefinir-senha`, { senhaAtual: senhaAtual, senhaNova: senhaNova }, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Redefinindo senha!`);
          return Observable.throw(error);
        })
      );
  }
}
