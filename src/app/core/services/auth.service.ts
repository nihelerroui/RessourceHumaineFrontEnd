import { Injectable } from "@angular/core";
import { ProfileUpdateRequest, User } from "src/app/models/auth.models";
import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GenericService } from "./generic.service";
import { LoginRequest } from "src/app/models/loginRequest.model";
import { Consultant } from "src/app/models/consultant.models";
import { PersonalDetails } from "src/app/models/PersonalDetails.model";

@Injectable({ providedIn: "root" })
export class AuthenticationService extends GenericService<User> {
  private authUrl = `${environment.apiUrl}/auth`;
  private baseUrl = `${environment.apiUrl}`;

  constructor(protected http: HttpClient) {
    super(http, "");
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  createUser(userDTO: any): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/createUser`, userDTO);
  }

  createPersonalDetails(personalDetails: any): Observable<PersonalDetails> {
    return this.http.post<PersonalDetails>(
      `${this.authUrl}/createPersonalDetails`,
      personalDetails
    );
  }

  createConsultant(consultant: any): Observable<Consultant> {
    return this.http.post<Consultant>(
      `${this.authUrl}/createConsultant`,
      consultant
    );
  }

  updateUser(userId: number, request: any): Observable<User> {
    return this.http.put<User>(`${this.authUrl}/updateUser/${userId}`, request);
  }

  updateConsultant(consultantId: number, request: any): Observable<Consultant> {
    return this.http.put<Consultant>(
      `${this.authUrl}/updateConsultant/${consultantId}`,
      request
    );
  }

  loadConsultants(): Observable<Consultant[]> {
    return this.http.get<Consultant[]>(`${this.baseUrl}/consultants`);
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

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/users/toggle-status/${userId}`,
      {}
    );
  }

  getAdminSocietes(): Observable<any[]> {
    const url = `https://featway-serveur.fr:8181/portail-backend-prod_v2/api/adminsociete/admin/141`;
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IkNPTlNVTFRBTlQsQURNSU4sU1VQRVJfQURNSU4iLCJzdWIiOiJwb3J0YWlsQHRlc3QuZnIiLCJpYXQiOjE3NDc2NTgzMzgsImV4cCI6MTc0NzkxNzUzOH0.0kPVREnhSRYgQQhxAworvHKFaHf8AlKfIaIxINdQMHA";

    const headers = new HttpHeaders()
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    return this.http.get<any[]>(url, { headers });
  }

  updateUserProfile(
    userId: number,
    profileData: ProfileUpdateRequest
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/users/update/${userId}`,
      profileData
    );
  }
}
