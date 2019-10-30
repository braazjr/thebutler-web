import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class TipoDocumentoService {

  constructor(private http: HttpClient) { }

  getTiposDocumento() {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/tipo-documentos`, { headers: hds, withCredentials: true });
  }

}
