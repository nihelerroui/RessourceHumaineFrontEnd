import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private tokenStorage: TokenStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        
    const excludedRoutes = ['/contratsClient/', '/contrats-client/', '/import-contrat/','facture/client/view'];

    const isExcluded = excludedRoutes.some(path => state.url.includes(path));
    const token = this.tokenStorage.getToken(isExcluded);
    if (token || isExcluded) {
      return true; 
    }

    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
