import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class DefaultService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  get(model) {
    return this.http.get(`${environment.urlSpring}/${model}`, { withCredentials: true });
  }

  getById(model, id) {
    return this.http.get(`${environment.urlSpring}/${model}/${id}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando ${model}!`);
          return Observable.throw(error);
        })
      );
  }

  salvar(model, entity) {
    return this.http.post(`${environment.urlSpring}/${model}`, entity, { withCredentials: true })
    .pipe(
      catchError(error => {
        this.httpUtil.showErrors(error, `Salvando ${model}!`);
        return Observable.throw(error);
      })
    );
  }

  atualizar(model, entity) {
    return this.http.put(`${environment.urlSpring}/${model}/${entity.id}`, entity, { withCredentials: true })
    .pipe(
      catchError(error => {
        this.httpUtil.showErrors(error, `Atualizando ${model}!`);
        return Observable.throw(error);
      })
    );
  }

  excluir(model, id) {
    return this.http.delete(`${environment.urlSpring}/${model}/${id}`, { withCredentials: true })
    .pipe(
      catchError(error => {
        this.httpUtil.showErrors(error, `Excluindo ${model}!`);
        return Observable.throw(error);
      })
    );
  }

  getDadosCep(cep) {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`)
    .pipe(
      catchError(error => {
        this.httpUtil.showErrors(error, `Consultando endereço!`);
        return Observable.throw(error);
      })
    );
  }

  getDashboard(dash) {
    return this.http.get(`${environment.urlSpring}/dashboards/${dash}`, { withCredentials: true })
    .pipe(
      catchError(error => {
        this.httpUtil.showErrors(error, `Carregando dashboard!`);
        return Observable.throw(error);
      })
    );
  }

  getUniqueInteger(dash) {
    return this.http.get(`${environment.urlSpring}/dashboards/${dash}`, { withCredentials: true })
    .pipe(
      catchError(error => {
        this.httpUtil.showErrors(error, `Carregando dashboard!`);
        return Observable.throw(error);
      })
    );
  }

}
