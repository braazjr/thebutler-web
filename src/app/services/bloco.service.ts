import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class BlocoService {

  constructor(private http: HttpClient) { }

  getBlocosPorCondominio(idCondominio) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/bloco/condominio/${idCondominio}`, { headers: hds, withCredentials: true });
  }

  getBlocos(pageable) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/bloco`, { headers: hds, withCredentials: true, params: pageable });
  }

}
