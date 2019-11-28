import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class MoradorService {

  constructor(private http: HttpClient) { }

  getViewApartamentoMorador(pageable) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/view/moradores`, { headers: hds, withCredentials: true, params: pageable });
  }
}
