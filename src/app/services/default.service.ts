import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DefaultService {

  constructor(private http: HttpClient) { }

  get(model) {
    return this.http.get(`${environment.urlSpring}/${model}/`, { withCredentials: true });
  }

  getById(model, id) {
    return this.http.get(`${environment.urlSpring}/${model}/${id}`, { withCredentials: true });
  }

  salvar(model, entity) {
    return this.http.post(`${environment.urlSpring}/${model}`, entity, { withCredentials: true });
  }

  atualizar(model, entity) {
    return this.http.put(`${environment.urlSpring}/${model}/${entity.id}`, entity, { withCredentials: true });
  }

  excluir(model, id) {
    return this.http.delete(`${environment.urlSpring}/${model}/${id}`, { withCredentials: true });
  }

  getDadosCep(cep) {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  getDashboard(dash) {
    return this.http.get(`${environment.urlSpring}/dashboards/${dash}`, { withCredentials: true });
  }

  getUniqueInteger(dash) {
    return this.http.get(`${environment.urlSpring}/dashboards/${dash}`, { withCredentials: true });
  }

}
