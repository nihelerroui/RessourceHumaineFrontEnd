import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { environment } from '../../../environments/environment';
import { FactureClient } from 'src/app/models/factureClient.models';

@Injectable({
  providedIn: 'root',
})
export class FactureClientService extends GenericService<any> {
  constructor(protected http: HttpClient) {
    super(http, 'facturesClient'); 
  }

  createFactureClient(facture: FactureClient): Observable<FactureClient> {
    return this.http.post<FactureClient>(`${this.apiUrl}/create`, facture);
  }
  
  updateFactureClient(facture: FactureClient): Observable<FactureClient> {
    return this.http.put<FactureClient>(`${this.apiUrl}/update`, facture);
  }

  envoyerRappel(factureId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/envoyerRappel/${factureId}`, null, {
      responseType: 'text',
    });
  }
  envoyerFacture(factureId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/envoyerFacture/${factureId}`, null, {
      responseType: 'text',
    });
  }

  getFacturesByClientId(clientId: number): Observable<FactureClient[]> {
    return this.http.get<FactureClient[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getPrestations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/prestations`);
  }

  getContratsClient(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/contratsClient`); 
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dto/${id}`);
  }  
  getFactureByToken(token: string): Observable<FactureClient> {
    return this.http.get<FactureClient>(`${this.apiUrl}/consulter?token=${token}`);
  }
  getFacturesValideesByClientId(clientId: number): Observable<FactureClient[]> {
    return this.http.get<FactureClient[]>(`${this.apiUrl}/facturesClient/client/valide/${clientId}`);
  }
  getFacturesRejeteesByClientId(clientId: number): Observable<FactureClient[]> {
    return this.http.get<FactureClient[]>(`${this.apiUrl}/client/rejete/${clientId}`);
  }
  getFacturesNonPayeesByClientId(clientId: number): Observable<FactureClient[]> {
    return this.http.get<FactureClient[]>(`${this.apiUrl}/client/nonpayee/${clientId}`);
  }  
  downloadFacture(factureClientId: number) {
    return this.http.get(`${this.apiUrl}/download/${factureClientId}`, {
      responseType: 'blob'
    });
  }
  
}
