import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ViagemService {

  constructor(
    private http: HttpClient
  ) { }

  getViagens(pageable) {
    return this.http.get(`${environment.urlSpring}/viagens`, { withCredentials: true, params: pageable });
  }

}
