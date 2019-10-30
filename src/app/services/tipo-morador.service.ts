import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class TipoMoradorService {

  constructor(private http: HttpClient) { }

  getTiposMorador() {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/tipo-moradores`, { headers: hds, withCredentials: true });
  }

}
