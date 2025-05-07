import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {
  private baseUrl = 'https://featway-serveur.fr:8181/portail-backend-dev/api/consultant';
  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IkNPTlNVTFRBTlQsQURNSU4sU1VQRVJfQURNSU4iLCJzdWIiOiJwb3J0YWlsQHRlc3QuZnIiLCJpYXQiOjE3NDY0MzM4MzcsImV4cCI6MTc0NjY5MzAzN30.8NLjzTKQ0N0Hj8CTrvKlbcHtlzt5mTBfp4Qd0e2qD7o';

  constructor(private http: HttpClient) {}

  getBySocieteByConsultant(id: number): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<any[]>(`${this.baseUrl}/getbysocietebyconsultant/${id}`, { headers });
  }
}
