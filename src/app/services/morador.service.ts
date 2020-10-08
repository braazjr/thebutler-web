import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class MoradorService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  getMoradores(pageable: any) {
    return this.http.get(`${environment.urlSpring}/moradores`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando moradores!`);
          return Observable.throw(error);
        })
      );
  }
}
