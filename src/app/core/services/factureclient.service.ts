import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FactureClientService extends GenericService<any> {
  constructor(protected http: HttpClient) {
    super(http, 'facturesClient'); // Using 'facturesClient' from the backend API
  }

  // Create a new FactureClient
  createFactureClient(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, data); // POST /create
  }

  // Get FactureClient preview by ID
  getFacturePreview(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/preview/${id}`); // GET /preview/{id}
  }

  // Fetch all prestations
  getPrestations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/prestations`); // GET /prestations
  }

  // Fetch all consultants
  getConsultants(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/consultants`); // GET /consultants
  }

  // Fetch all contratsClient
  getContratsClient(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/contratsClient`); // GET /contratsClient
  }
}
