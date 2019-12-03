import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class BlocoService {

  constructor(private http: HttpClient) { }

  getBlocosPorCondominio(idCondominio) {
    return this.http.get(`${environment.urlSpring}/blocos/condominio/${idCondominio}`, { withCredentials: true });
  }

  getBlocos(pageable) {
    return this.http.get(`${environment.urlSpring}/blocos`, { withCredentials: true, params: pageable });
  }

}
