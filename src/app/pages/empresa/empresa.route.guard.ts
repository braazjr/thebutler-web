import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../services/shared.service';

@Injectable()
export class EmpresaRouteGuard implements CanActivate {

    constructor(private router: Router, private sharedService: SharedService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        if (next.data.role && !this.sharedService.checkRole([next.data.role])) {
            this.router.navigate(['/nao-autorizado']);
            return false;
        }

        return true;
    }
}
