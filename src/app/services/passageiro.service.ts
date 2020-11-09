import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class PassageiroService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  getPassageiros(pageable: any) {
    return this.http.get(`${environment.urlSpring}/passageiros`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando passageiroes!`);
          return Observable.throw(error);
        })
      );
  }
}
