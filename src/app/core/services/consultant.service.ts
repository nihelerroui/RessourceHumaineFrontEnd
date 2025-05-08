import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {
  private baseUrl = 'https://featway-serveur.fr:8181/portail-backend-dev/api/consultant';

  constructor(private http: HttpClient) {}

  getBySocieteByConsultant(id: number): Observable<any[]> {
    const headers = new HttpHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/getbysocietebyconsultantPFE/${id}`, { headers });
  }
}
