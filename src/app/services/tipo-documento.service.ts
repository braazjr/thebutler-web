import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { Observable } from 'rxjs';

@Injectable()
export class TipoDocumentoService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getTiposDocumento() {
    return this.http.get(`${environment.urlSpring}/tipo-documentos`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Carregando tipos de documento!`);
          return Observable.throw(error);
        })
      );
  }

}
