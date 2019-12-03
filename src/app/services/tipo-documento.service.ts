import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class TipoDocumentoService {

  constructor(private http: HttpClient) { }

  getTiposDocumento() {
    return this.http.get(`${environment.urlSpring}/tipo-documentos`, { withCredentials: true });
  }

}
