import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { Observable } from 'rxjs';

@Injectable()
export class MoradorService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getViewApartamentoMorador(pageable) {
    return this.http.get(`${environment.urlSpring}/view/moradores`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Carregando moradores!`);
          return Observable.throw(error);
        })
      );
  }
}
