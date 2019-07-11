import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DefaultService {

  constructor(private http: HttpClient) { }

  get(model) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/${model}/`, { headers: hds, withCredentials: true });
  }

  getById(model, id) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/${model}/${id}`, { headers: hds, withCredentials: true });
  }

  salvar(model, entity) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post(`${environment.urlSpring}/${model}`, entity, { headers: hds, withCredentials: true });
  }

  atualizar(model, entity) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.put(`${environment.urlSpring}/${model}/${entity.id}`, entity, { headers: hds, withCredentials: true });
  }

  excluir(model, id) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.delete(`${environment.urlSpring}/${model}/${id}`, { headers: hds, withCredentials: true });
  }

  getDadosCep(cep) {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  getDashboard(dash) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/dashboard/${dash}`, { headers: hds, withCredentials: true });
  }

  getUniqueInteger(dash) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/dashboard/${dash}`, { headers: hds, withCredentials: true });
  }

}
