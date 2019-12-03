import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ApartamentoService {

  constructor(
    private http: HttpClient
  ) { }

  getApartamentosPorBloco(idBloco) {
    return this.http.get(`${environment.urlSpring}/apartamentos/bloco/${idBloco}`, { withCredentials: true });
  }

  getApartamentoPorMorador(idMorador) {
    return this.http.get(`${environment.urlSpring}/view/morador/${idMorador}`, { withCredentials: true });
  }

  getApartamentosPaginados(pageable) {
    return this.http.get(`${environment.urlSpring}/apartamentos/`, { withCredentials: true, params: pageable });
  }

  getFicha(idApartamento) {
    return this.http.get(`${environment.urlSpring}/apartamentos/${idApartamento}/ficha`, { withCredentials: true, observe: 'response', responseType: 'blob' });
  }

  getApartamentos(pageable) {
    return this.http.get(`${environment.urlSpring}/apartamentos`, { withCredentials: true, params: pageable });
  }

}
