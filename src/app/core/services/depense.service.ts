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
  override update(id: string, data: any): Observable<any> {
    // Send to base URL without ID in path
    return this.http.put<any>(this.apiUrl, data);
  }

  // Keep custom endpoints
  createDepense(depenseDTO: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, depenseDTO);
  }

  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/factures`);
  }

  getSocietes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/societes`);
  }
}