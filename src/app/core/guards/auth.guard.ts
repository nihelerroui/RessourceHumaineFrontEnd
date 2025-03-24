import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    // Routes that should be accessible without authentication
    private publicRoutes: string[] = [
        '/auth/login',
        '/forgot-password',
        '/reset-password'
    ];

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Check if the current route is in the public routes list
        if (this.isPublicRoute(state.url)) {
            return true; // Allow access to public routes without authentication
        }

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

    /**
     * Checks if the current route is a public route
     * @param url Current route URL
     * @returns True if the route is public
     */
    private isPublicRoute(url: string): boolean {
        // Check exact matches
        if (this.publicRoutes.includes(url)) {
            return true;
        }
        
        // Check for routes with query parameters (like reset-password?token=xyz)
        const baseUrl = url.split('?')[0];
        return this.publicRoutes.includes(baseUrl);
    }
}