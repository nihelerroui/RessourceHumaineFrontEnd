import { Injectable } from "@angular/core";
import {
  User,
} from "src/app/models/auth.models";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GenericService } from "./generic.service";
import { LoginRequest } from "src/app/models/loginRequest.model";
import { AdminRegisterRequest } from "src/app/models/adminRegisterRequest.models";

@Injectable({ providedIn: "root" })
export class AuthenticationService extends GenericService<User> {

  private authUrl = `${environment.apiUrl}/auth`;
  private baseUrl = `${environment.apiUrl}`;

  private userCreatedSubject = new BehaviorSubject<boolean>(false);
  private userUpdatedSubject = new BehaviorSubject<boolean>(false);

  userCreated$ = this.userCreatedSubject.asObservable();
  userUpdated$ = this.userUpdatedSubject.asObservable();

  constructor(protected http: HttpClient) {
    super(http,''); 
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  register(registerData: AdminRegisterRequest): Observable<any> {
    return this.http.post<any>(
      `${this.authUrl}/admin/register-user`,
      registerData
    );
  }

  logout() {
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("currentUser");
    window.location.href = "/auth/login";
  }

  getUser(): Observable<any> {
    const token = sessionStorage.getItem("currentUserToken");
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;
    return this.http.get<any>(`${this.authUrl}/me`, { headers });
  }

  modifyUser(userId: number, data: AdminRegisterRequest): Observable<any> {
    return this.http.put(`${this.authUrl}/admin/modify-user/${userId}`, data);
  }
  
  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users`);
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/toggle-status/${userId}`, {});
  }



getAdminSocietes(): Observable<any[]> {
  const url = `https://featway-serveur.fr:8181/portail-backend-prod_v2/api/adminsociete/admin/141`;
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IkNPTlNVTFRBTlQsQURNSU4sU1VQRVJfQURNSU4iLCJzdWIiOiJwb3J0YWlsQHRlc3QuZnIiLCJpYXQiOjE3NDcwMzgxMjIsImV4cCI6MTc0NzI5NzMyMn0.5xP8ZQn4y6ux12Mw3uodDEWtrfK7Kq-pZSzkfBLS7pw';

  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  console.log('Headers envoyés:', headers.keys(), headers.get('Authorization'));


  return this.http.get<any[]>(url, { headers });
}




  

 
}
