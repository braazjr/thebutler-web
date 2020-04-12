import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class BlocoService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  getBlocosPorCondominio(idCondominio) {
    return this.http.get(`${environment.urlSpring}/blocos/condominio/${idCondominio}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando blocos!`);
          return Observable.throw(error);
        })
      );
  }

  getBlocos(pageable) {
    return this.http.get(`${environment.urlSpring}/blocos`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando blocos!`);
          return Observable.throw(error);
        })
      );
  }

}
