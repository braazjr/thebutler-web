import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DocumentoService {

  constructor(
    private http: HttpClient
  ) { }

  getDocumentosPorApartamento(id) {
    return this.http.get(`${environment.urlSpring}/public/documento/apartamento/${id}`, { withCredentials: true });
  }

  excluirDocumento(id) {
    return this.http.delete(`${environment.urlSpring}/public/documento/${id}`, { withCredentials: true });
  }

  uploadDocumentos(idApartamento, files) {
    let formdata: FormData = new FormData();
    formdata.append('file', files);

    return this.http.post(`${environment.urlSpring}/public/documento/upload-documento/${idApartamento}`, files, { withCredentials: true, reportProgress: true });
  }
}
