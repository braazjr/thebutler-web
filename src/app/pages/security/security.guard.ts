import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/auth/login']);
    } else if (this.authService.isAccessTokenInvalido()) {
      console.info('-- navegação com access token inválido. Obtendo novo token...');

      return this.authService.obterNovoAccessToken().map(() => {
        if (this.authService.isAccessTokenInvalido()) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        return true;
      });
    }
    //  else if (next.data.roles && !this.authService.temQualquerPermissao(next.data.roles)) {
    //     this.router.navigate(['/nao-autorizado']);
    //     return false;
    // }

    // this.authService.atualizaUsuario();

    return true;
  }

}
