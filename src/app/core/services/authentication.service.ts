import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { BehaviorSubject } from 'rxjs';

// Interface matching the AdminRegisterRequest DTO
export interface AdminRegisterRequest {
  // User fields
  email: string;
  password: string;
  role: string;
  enabled: boolean;

  // Consultant fields
  fullName: string;
  name: string;
  prenom: string;
  telephone: string;
  typeLibelle: string;
  dateRecrutement: string | null; // Dates will be serialized to ISO strings
  dateSortie: string | null;
  fonction: string;
  matricule: string;
  commercial: boolean;

  // PersonalDetails fields (all optional)
  attestations?: string;
  bic?: string;
  bisTer?: string;
  carteGrise?: string;
  cni?: string;
  codePostal?: string;
  complementAdr?: string;
  contart?: string;
  dateDebCni?: string | null;
  dateFinCni?: string | null;
  iban?: string;
  kbis?: string;
  navigo?: string;
  nomRue?: string;
  numRue?: string;
  nummss?: string;
  photo?: string;
  rib?: string;
  urssaf?: string;
  ville?: string;
}

// Create a new interface for profile updates (without role field)
export interface ProfileUpdateRequest {
  // User fields
  email: string;
  
  // Consultant fields
  fullName: string;
  name: string;
  prenom: string;
  telephone: string;
  typeLibelle: string;
  dateRecrutement: string | null;
  dateSortie: string | null;
  fonction: string;
  matricule: string;
  commercial: boolean;

  // PersonalDetails fields (all optional)
  attestations?: string;
  bic?: string;
  bisTer?: string;
  carteGrise?: string;
  cni?: string;
  codePostal?: string;
  complementAdr?: string;
  contart?: string;
  dateDebCni?: string | null;
  dateFinCni?: string | null;
  iban?: string;
  kbis?: string;
  navigo?: string;
  nomRue?: string;
  numRue?: string;
  nummss?: string;
  photo?: string;
  rib?: string;
  urssaf?: string;
  ville?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private baseUrlAuth = `${environment.apiUrl}/auth`;
  private baseUrl = `${environment.apiUrl}`;
  private userCreatedSubject = new BehaviorSubject<boolean>(false);
  private userUpdatedSubject = new BehaviorSubject<boolean>(false);

  constructor(protected http: HttpClient) {}
  
  userCreated$ = this.userCreatedSubject.asObservable();
  userUpdated$ = this.userUpdatedSubject.asObservable();
  
  notifyUserCreated(): void {
    this.userCreatedSubject.next(true);
  }
  
  notifyUserUpdated(): void {
    this.userUpdatedSubject.next(true);
  }
  
  // Login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrlAuth}/login`, credentials);
  }
  
  updateUser(userId: number, userData: AdminRegisterRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrlAuth}/admin/modify-user/${userId}`, userData);
  }

  // New method for updating user profile
  updateUserProfile(userId: number, profileData: ProfileUpdateRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/update/${userId}`, profileData);
  }

  // Updated Register method to match the backend API
  register(registerData: AdminRegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrlAuth}/admin/register-user`, registerData);
  }

  // Get user details using the provided token in headers (Authorization)
  getUser(): Observable<any> {
    // Retrieve the token from sessionStorage (or wherever you store it)
    const token = sessionStorage.getItem("currentUserToken");
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;
    return this.http.get<any>(`${this.baseUrlAuth}/me`, { headers });
  }
  
  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users`);
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/toggle-status/${userId}`, {});
  }
  // Request password reset (send email)
forgotPassword(email: string): Observable<any> {
  return this.http.post<any>(`${this.baseUrlAuth}/forgot-password`, { email });
}

// Reset password with token
resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post<any>(`${this.baseUrlAuth}/reset-password`, { 
    token, 
    newPassword 
  });
}

// Validate reset token
validateResetToken(token: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrlAuth}/validate-reset-token/${token}`);
}
}