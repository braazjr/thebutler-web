import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isOAuthUrl(req) && this.authService.isAccessTokenInvalido()) {
      console.info('-- requisição com access token inválido. Obtendo novo token...');

      this.authService.obterNovoAccessToken()
        .pipe(
          switchMap(() => {
            console.info('-- novo token gerado. seguindo com requisição...');

            return next.handle(req.clone({
              setHeaders: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
              }
            }));
          })
        )
    } else {
      return next.handle(req);
    }
  }

  isOAuthUrl(req) {
    return req.url.split('/')[3] == 'oauth';
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AuthInterceptorModule { }
