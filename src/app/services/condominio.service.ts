import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class CondominioService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  getBlocosByCondominio(condominioId) {
    return this.http.get(`${environment.urlSpring}/blocos/condominio/${condominioId}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando blocos!`);
          return Observable.throw(error);
        })
      );
  }
}
