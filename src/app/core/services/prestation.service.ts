// src/app/core/services/prestation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
// src/app/core/services/prestation.service.ts
@Injectable({
  providedIn: 'root'
})
export class PrestationService {
  private apiUrl = `${environment.apiUrl}/prestations`;

  constructor(private http: HttpClient) { }

  getPrestations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deletePrestation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createPrestation(prestationDTO: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/create`, prestationDTO);
    
  }

  // Add PUT request to update prestation
  updatePrestation(prestationDTO: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, prestationDTO);
  }
}
