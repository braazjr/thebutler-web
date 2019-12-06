import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class TipoMoradorService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getTiposMorador() {
    return this.http.get(`${environment.urlSpring}/tipo-moradores`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Carregando tipos de morador!`);
          return Observable.throw(error);
        })
      );
  }

}
