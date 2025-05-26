import { HTTP_INTERCEPTORS, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { TokenStorageService } from "../../core/services/token-storage.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const excludedRoutes = [
      "/contratsClient/",
      "/contrats-client/",
      "/import-contrat/",
      "facture/client/view",
    ];
    const isExcludedRoute = excludedRoutes.some((path) =>
      req.url.includes(path)
    );
    const isSecuredApi = req.url.startsWith(`${environment.apiUrl}`);
    const token = this.token.getToken(isExcludedRoute);

    if (isSecuredApi && token && token !== "null") {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
