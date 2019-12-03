import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class TipoMoradorService {

  constructor(private http: HttpClient) { }

  getTiposMorador() {
    return this.http.get(`${environment.urlSpring}/tipo-moradores`, { withCredentials: true });
  }

}
