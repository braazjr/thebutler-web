import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class DocumentoService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getDocumentosPorApartamento(id) {
    return this.http.get(`${environment.urlSpring}/public/documento/apartamento/${id}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Carregando documentos!`);
          return Observable.throw(error);
        })
      );
  }

  excluirDocumento(id) {
    return this.http.delete(`${environment.urlSpring}/public/documento/${id}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Excluindo documento!`);
          return Observable.throw(error);
        })
      );
  }

  uploadDocumentos(idApartamento, files) {
    let formdata: FormData = new FormData();
    formdata.append('file', files);

    return this.http.post(`${environment.urlSpring}/public/documento/upload-documento/${idApartamento}`, files, { withCredentials: true, reportProgress: true })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Upload de documento!`);
          return Observable.throw(error);
        })
      );
  }
}
