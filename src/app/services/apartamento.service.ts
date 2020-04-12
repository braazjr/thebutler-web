import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class ApartamentoService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  getApartamentosPorBloco(idBloco) {
    return this.http.get(`${environment.urlSpring}/apartamentos/bloco/${idBloco}`, { withCredentials: true })
      .pipe(
        catchError(error => this.catchErrorCustom(error))
      );
  }

  getApartamentoPorMorador(idMorador) {
    return this.http.get(`${environment.urlSpring}/view/morador/${idMorador}`, { withCredentials: true })
      .pipe(
        catchError(error => this.catchErrorCustom(error))
      );
  }

  getApartamentosPaginados(pageable) {
    return this.http.get(`${environment.urlSpring}/apartamentos/`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => this.catchErrorCustom(error))
      );
  }

  getFicha(idApartamento) {
    return this.http.get(`${environment.urlSpring}/apartamentos/${idApartamento}/ficha`, { withCredentials: true, observe: 'response', responseType: 'blob' })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando PDF ficha!`);
          return Observable.throw(error);
        })
      );
  }

  getApartamentos(pageable) {
    return this.http.get(`${environment.urlSpring}/apartamentos`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => this.catchErrorCustom(error))
      );
  }

  private catchErrorCustom(error) {
    this.httpUtil.showErrors(error, `Carregando apartamentos!`);
    return Observable.throw(error);
  }
}
