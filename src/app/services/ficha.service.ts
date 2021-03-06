import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpUtil } from '../utils/http.util';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FichaService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  getFichaPorApartamento(apartamentoId) {
    return this.http.get(`${environment.urlSpring}/fichas/apartamento/${apartamentoId}`)
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando fichas por apartamento!`);
          return Observable.throw(error);
        })
      );
  }

  getFullFicha(id: any) {
    return this.http.get(`${environment.urlSpring}/fichas/${id}/full`)
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando ficha!`);
          return Observable.throw(error);
        })
      );
  }

  get(pageable) {
    return this.http.get(`${environment.urlSpring}/fichas`, { params: pageable })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando fichas!`);
          return Observable.throw(error);
        })
      );
  }

  getFichaPdf(id) {
    return this.http.get(`${environment.urlSpring}/fichas/${id}/download-pdf`, { withCredentials: true, observe: 'response', responseType: 'blob' })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando PDF ficha!`);
          return Observable.throw(error);
        })
      );
  }

  removeMorador(id: string, moradorId: string) {
    return this.http.patch(`${environment.urlSpring}/fichas/${id}/remove-morador/${moradorId}`, {})
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Removendo morador!`);
          return Observable.throw(error);
        })
      );
  }

  addMorador(id: string, morador: any) {
    return this.http.patch(`${environment.urlSpring}/fichas/${id}/add-morador`, morador)
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Salvando morador!`);
          return Observable.throw(error);
        })
      );
  }
}
