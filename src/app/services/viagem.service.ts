import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class ViagemService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getViagens(pageable) {
    return this.http.get(`${environment.urlSpring}/viagens`, { withCredentials: true, params: pageable })
      .pipe(
        catchError(error => {
          this.sharedService.showErrors(error, `Carregando viagens!`);
          return Observable.throw(error);
        })
      );
  }

}
