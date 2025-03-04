import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Depense } from '../../shared/models/depense.model';

@Injectable({
  providedIn: 'root',
})
export class DepenseService {
  private apiUrl = 'http://localhost:8089/spring/depenses';

  constructor(private http: HttpClient) {}

  // Fetch all depenses
  getDepenses(): Observable<Depense[]> {
    return this.http.get<Depense[]>(this.apiUrl);
  }

  // Create a new depense
  createDepense(depense: Depense): Observable<Depense> {
    return this.http.post<Depense>(this.apiUrl, depense);
  }

  // Update an existing depense
  updateDepense(depense: Depense): Observable<Depense> {
    return this.http.put<Depense>(`${this.apiUrl}/${depense.depenseId}`, depense);
  }

  // Delete a depense by ID
  deleteDepense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Fetch all factures
  getFactures(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8089/spring/factures');
  }

  // Fetch all societes
  getSocietes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8089/spring/societes');
  }
}