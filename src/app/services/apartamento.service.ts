import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DataTablesService } from './data-tables.service';

@Injectable()
export class ApartamentoService {

  constructor(
    private http: HttpClient,
    private dataTablesService: DataTablesService
  ) { }

  getApartamentosPorBloco(idBloco) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/apartamentos/bloco/${idBloco}`, { headers: hds, withCredentials: true });
  }

  getApartamentoPorMorador(idMorador) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/view/morador/${idMorador}`, { headers: hds, withCredentials: true });
  }

  getApartamentosPaginados(pageable) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/apartamentos/`, { headers: hds, withCredentials: true, params: pageable });
  }

  getFicha(idApartamento) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'responseType': 'blob'
    });

    return this.http.get(`${environment.urlSpring}/apartamentos/${idApartamento}/ficha`, { headers: hds, withCredentials: true, observe: 'response', responseType: 'blob' });
  }

  getApartamentos(pageable) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/apartamentos`, { headers: hds, withCredentials: true, params: pageable });
  }

}
