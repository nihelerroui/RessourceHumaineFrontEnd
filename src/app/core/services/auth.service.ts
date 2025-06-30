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


  updatePersonalDetailsWithFiles(
    personalDetailsId: number,
    dto: any,
    files: {
      cniFile?: File;
      carteGriseFile?: File;
      navigoFile?: File;
      attestationsFiles?: File[];
      contratFile?: File;
      kbisFile?: File;
      urssafFile?: File;
      photoFile?: File;
      ribFile?: File;
    }
  ): Observable<PersonalDetails> {
    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    if (files.cniFile) formData.append('cniFile', files.cniFile);
    if (files.carteGriseFile) formData.append('carteGriseFile', files.carteGriseFile);
    if (files.navigoFile) formData.append('navigoFile', files.navigoFile);
    if (files.contratFile) formData.append('contratFile', files.contratFile);
    if (files.kbisFile) formData.append('kbisFile', files.kbisFile);
    if (files.urssafFile) formData.append('urssafFile', files.urssafFile);
    if (files.photoFile) formData.append('photoFile', files.photoFile);
    if (files.ribFile) formData.append('ribFile', files.ribFile);

    // Fichiers multiples
    if (files.attestationsFiles) {
      files.attestationsFiles.forEach((file) => {
        formData.append('attestationsFiles', file);
      });
    }

    return this.http.put<PersonalDetails>(
  `${this.authUrl}/updatePersonalDetailsWithFiles/${personalDetailsId}`,
  formData
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
    
    const url = `${environment.baseUrl}/adminsociete/admin/141`;
  
    const headers = new HttpHeaders()
      .set("Authorization", `Bearer ${environment.token}`)
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


   forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password`, {
      token,
      newPassword
    });
  }

   getUserImage(): Promise<string | null> {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const filename = currentUser?.personalDetails?.photo;
    if (!filename) return Promise.resolve(null);

    const cleanFilename = filename.split('/').pop();
    const url = `${this.authUrl}/files/photo/${encodeURIComponent(cleanFilename)}`;
    const token = sessionStorage.getItem('auth-token');

    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => URL.createObjectURL(blob))
      .catch(err => {
        console.error('Erreur chargement photo utilisateur :', err);
        return null;
      });
  }


  

}
