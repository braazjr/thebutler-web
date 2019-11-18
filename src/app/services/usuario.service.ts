import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class UsuarioService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  getUsuarioPorEmpresa(pageable, ) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/usuarios`, { headers: hds, withCredentials: true, params: pageable });
  }
}
