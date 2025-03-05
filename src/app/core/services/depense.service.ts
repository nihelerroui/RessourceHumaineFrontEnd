import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Depense } from '../../shared/models/depense.model';

@Injectable({
  providedIn: 'root',
})
export class DepenseService {
  private apiUrl = `${environment.apiUrl}/depenses`;

  constructor(private http: HttpClient) {}

  // Fetch all depenses
  getDepenses(): Observable<Depense[]> {
    return this.http.get<Depense[]>(this.apiUrl);
  }

  // Delete a depense by ID
  deleteDepense(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Create a new depense
  createDepense(depense: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, depense);
  }

  // Update an existing depense
  updateDepense(depense: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, depense);
  }

  // Fetch all factures
  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/factures`);
  }

  // Fetch all societes
  getSocietes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/societes`);
  }
}
