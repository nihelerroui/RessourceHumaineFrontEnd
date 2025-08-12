import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { GenericService } from './generic.service';
import { ClientMetrics } from 'src/app/models/ClientMetrics.model';
import { map, Observable } from 'rxjs';
import { Rentabilite } from 'src/app/models/Rentabilite.model';
import { environment } from 'src/environments/environment';

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
  getRentabilites(year: number, societeId: number): Observable<Rentabilite[]> {
  return this.http.get<Rentabilite[]>(`${this.apiUrl}/rentabilites?year=${year}&societeId=${societeId}`);
}
 getClientsRetardataires(): Observable<Client[]> {
    return this.http.get<any>(`${environment.pythonUrl}/clients-retardataires`).pipe(
      // extraire la liste dans la réponse JSON
      map(response => response.clients_retardataires)
    );
  }
}
