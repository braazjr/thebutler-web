import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaGuard implements CanActivate {

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.info('-- verificando perfil')
    const profiles = next.data.profiles;

    console.info(`-- profiles permitidos ${profiles}`)
    if (!this.sharedService.checkRole(profiles)) {
      console.log('-- acesso negado')
      this.router.navigate(['/access-denied']);
    }

    return true;
  }

}
