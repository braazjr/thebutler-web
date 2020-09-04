import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class DocumentoService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil
  ) { }

  excluirDocumento(idFicha, idDocumento) {
    return this.http.delete(`${environment.urlSpring}/fichas/${idFicha}/documento/${idDocumento}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Excluindo documento!`);
          return Observable.throw(error);
        })
      );
  }

  uploadDocumentos(idFicha, file) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    return this.http.post(`${environment.urlSpring}/fichas/${idFicha}/documento/upload-documento`, formdata,
      { withCredentials: true, reportProgress: true, responseType: 'text' })
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Upload de documento!`);
          return Observable.throw(error);
        })
      );
  }

  getDocumentosPorFicha(fichaId) {
    return this.http.get(`${environment.urlSpring}/fichas/${fichaId}/documentos`)
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Carregando documentos!`);
          return Observable.throw(error);
        })
      );
  }
}
