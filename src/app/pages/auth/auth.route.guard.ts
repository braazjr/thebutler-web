import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class RouteGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!localStorage.getItem('token')) {
            this.router.navigate(['/auth/login']);
        } else if (this.authService.isAccessTokenInvalido()) {
            console.info('Navegação com access token inválido. Obtendo novo token...');

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
