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