import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(protected http: HttpClient) {}

  // Login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  // Register method
  register(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, credentials);
  }

  // Get user details using the provided token in headers (Authorization)
  getUser(): Observable<any> {
    // Retrieve the token from sessionStorage (or wherever you store it)
    const token = sessionStorage.getItem('currentUserToken');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;
    return this.http.get<any>(`${this.baseUrl}/me`, { headers });
  }
}
