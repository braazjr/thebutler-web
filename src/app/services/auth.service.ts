import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from './usuario.service';
import { SharedService } from './shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {

  oauthTokenUrl = `${environment.urlSpring}/oauth/token`;
  jwtPayload: any;
  tokensRenokeUrl = `${environment.urlSpring}/tokens/revoke`;

  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, private router: Router, private usuarioService: UsuarioService, private sharedService: SharedService) { }

  login(usuario: String, senha: String): Observable<void> {
    const hds = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YW5ndWxhcjpAbmd1bEByMA=='
    });

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body,
      { headers: hds, withCredentials: true })
      .map(response => {
        this.armazenarToken(response['access_token']);
      })
      .catch(response => {
        if (response.status === 400) {
          const responseJson = response.json();

          if (responseJson.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }

        return Promise.reject(response);
      });
  }

  private armazenarToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    // this.http.delete(this.tokensRenokeUrl, { withCredentials: true })
    //   .toPromise()
    //   .then(() => {
    //     console.log('teste')
    //     this.limparAccessToken();
    //     this.router.navigate(['/login']);
    //   });

    this.limparAccessToken();
    this.router.navigate(['/auth/login']);
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    const jwtHelper: JwtHelperService = new JwtHelperService();

    return !token || jwtHelper.isTokenExpired(token);
  }

  obterNovoAccessToken() {
    const hds = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YW5ndWxhcjpAbmd1bEByMA=='
    });

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body,
      { headers: hds, withCredentials: true })
      .map(response => {
        this.armazenarToken(response['access_token']);

        console.info('Novo access token criado!');

        return Promise.resolve(null);
      })
      .catch(error => {
        console.info('Erro ao renovar token.', error);
        return Promise.resolve(null);
      });
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temQualquerPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  atualizaUsuario() {
    this.sharedService.usuario = JSON.parse(localStorage.getItem('usuario'));
  }
}
