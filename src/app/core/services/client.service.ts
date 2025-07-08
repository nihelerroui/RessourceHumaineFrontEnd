import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { GenericService } from './generic.service';
import { ClientMetrics } from 'src/app/models/ClientMetrics.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends GenericService<Client> {

  constructor(protected http: HttpClient) {
    super(http, 'clients'); 
  }
  envoyerEmailImport(clientId: number) {
    return this.http.post(`${this.apiUrl}/envoyer-email/${clientId}`, {});
  }
   getAllClientMetrics(): Observable<ClientMetrics[]> {
    return this.http.get<ClientMetrics[]>(`${this.apiUrl}/metrics`);
  }
  getRentabilitesForYear(year: number): Observable<any[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<any[]>(`${this.apiUrl}/rentabilites`, { params });
  }
}
