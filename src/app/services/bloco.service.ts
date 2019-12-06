import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { Observable } from 'rxjs';

@Injectable()
export class BlocoService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getBlocosPorCondominio(idCondominio) {
    return this.http.get(`${environment.urlSpring}/blocos/condominio/${idCondominio}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Carregando blocos!`);
          return Observable.throw(error);
        })
      );
  }

  getBlocos(pageable) {
    return this.http.get(`${environment.urlSpring}/blocos`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Carregando blocos!`);
          return Observable.throw(error);
        })
      );
  }

}
