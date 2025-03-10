// src/app/core/services/facture.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8089/spring/factures';

  constructor(private http: HttpClient) {}

  // Fetch a single facture by ID
  getFactureById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dto/${id}`);
  }

  // Delete a facture by ID
  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}