import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Check sessionStorage and localStorage for authentication
        const token = sessionStorage.getItem('currentUserToken');
        const userData = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');

        if (token && userData) {
            return true; // Allow access if user is authenticated
        }

        // Redirect to login with return URL
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
