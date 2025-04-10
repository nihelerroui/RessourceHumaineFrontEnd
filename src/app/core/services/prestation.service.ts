import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service'; // Import GenericService

@Injectable({
  providedIn: 'root'
})
export class PrestationService extends GenericService<any> {
  constructor(http: HttpClient) {
    super(http, 'prestations');
  }

  createPrestation(prestationDTO: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, prestationDTO);
  }

  updatePrestation(prestationDTO: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, prestationDTO);
  }

  getClientDetails(clientId: number): Observable<any> {
    return this.http.get(`http://localhost:8089/spring/clients/${clientId}`);
  }

  filterByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-date?createdAt=${date}`);
  }

  getContrats(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8089/spring/contratsClient');
  }

  getPrestationDetails(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
