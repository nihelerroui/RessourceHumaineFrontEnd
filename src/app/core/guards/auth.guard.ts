import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../../environments/environment';

// Auth Services
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private tokenStorage: TokenStorageService
    ) { }

 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const excludedRoutes = ['/contratsClient/', '/contrats-client/', '/import-contrat/', 'facture/client/view', '/reset-password'];
  const isExcluded = excludedRoutes.some(path => state.url.includes(path));
  const token = this.tokenStorage.getToken(isExcluded);

  if (environment.defaultauth === 'firebase') {
    const url: string = state.url;  
        if (url.includes('/cra/ValidCras')||url.includes('/skote/cra/ValidCras'))
         {       return true; 
         }

} else {
        if (isExcluded)
         {       return true; 
         }
    if (localStorage.getItem('currentUser')) {
        return true;
    }
}
this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
return false;
}
  
}

