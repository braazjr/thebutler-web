import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class MoradorService {

  constructor(private http: HttpClient) { }

  getViewApartamentoMorador(pageable) {
    return this.http.get(`${environment.urlSpring}/view/moradores`, { withCredentials: true, params: pageable });
  }
}
