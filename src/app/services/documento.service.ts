import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DocumentoService {

  constructor(
    private http: HttpClient
  ) { }

  getDocumentosPorApartamento(id) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/public/documento/apartamento/${id}`, { headers: hds, withCredentials: true });
  }

  excluirDocumento(id) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.delete(`${environment.urlSpring}/public/documento/${id}`, { headers: hds, withCredentials: true });
  }

  uploadDocumentos(idApartamento, files) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    let formdata: FormData = new FormData();
    formdata.append('file', files);

    return this.http.post(`${environment.urlSpring}/public/documento/upload-documento/${idApartamento}`, files, { headers: hds, withCredentials: true, reportProgress: true });
  }
}
