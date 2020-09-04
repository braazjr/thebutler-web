import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class TipoMoradorService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  getTiposMorador() {
    return this.http.get(`${environment.urlSpring}/tipos-moradores`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando tipos de morador!`);
          return Observable.throw(error);
        })
      );
  }

}
