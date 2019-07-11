import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ViagemService {

  constructor(
    private http: HttpClient
  ) { }

  getViagens(pageable) {
    const hds = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${environment.urlSpring}/viagem`, { headers: hds, withCredentials: true, params: pageable });
  }

}
