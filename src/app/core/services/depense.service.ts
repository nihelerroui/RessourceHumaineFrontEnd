import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepenseService extends GenericService<any> {

  constructor(protected http: HttpClient) {
    super(http, 'depenses');
  }

  // Override the generic update method to match backend API
  override update(data: any): Observable<any> {
    // Send to base URL without ID in path
    return this.http.put<any>(this.apiUrl, data);
  }

  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/factures`);
  }

  getSocietes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/societes`);
  }

  getUnassignedFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/factures/unassigned`);
  }

  getDepenseDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}