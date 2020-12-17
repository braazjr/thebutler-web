import { SharedService } from './../shared/shared.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpUtil } from '../utils/http.util';

@Injectable()
export class EmpresaService {

  constructor(
    private http: HttpClient,
    private httpUtil: HttpUtil,
    private sharedService: SharedService
  ) { }
  
  saveBravaSoftConfiguration(configuration) {
    const usuarioLogado = this.sharedService.getUsuarioLogged()
    return this.http.patch(`${environment.urlSpring}/empresas/${usuarioLogado.empresa.id}/save-bravasoft-configuration`, configuration)
      .pipe(
        catchError(error => {
          this.httpUtil.showErrors(error, `Salvando BravaSoft Configuration!`);
          return Observable.throw(error);
        })
      );
  }
}
