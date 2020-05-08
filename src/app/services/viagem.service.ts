import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class ViagemService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  getViagens(listaData) {
    return this.http.get(`${environment.urlSpring}/viagens`, { withCredentials: true, params: listaData })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando viagens!`);
          return Observable.throw(error);
        })
      );
  }

}
