import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {

  protected baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.baseUrl}`;
  }

  getBySocieteByConsultant(id: number): Observable<any[]> {
    const headers = new HttpHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/getbysocietebyconsultantPFE/${id}`, { headers });
  }
}
