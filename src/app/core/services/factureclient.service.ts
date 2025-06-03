import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { environment } from '../../../environments/environment';
import { FactureClient } from 'src/app/models/factureClient.models';
import { Prestation } from 'src/app/models/prestation.model';

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
  updateFactureWithToken(facture: FactureClient, token: string): Observable<FactureClient> {
  return this.http.put<FactureClient>(`${this.apiUrl}/client/update?token=${token}`, facture);
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
  getPrestationsByContratId(contratId: number): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(
      `${this.apiUrl}/prestations/contrat/${contratId}`
    );
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
  getWorkingDays(consultant_id: number, month: number, year: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/working-days?consultant_id=${consultant_id}&month=${month}&year=${year}`);
  }
  getFacturesBySocietesAdmin(): Observable<FactureClient[]> {
    return this.http.get<FactureClient[]>(`${this.apiUrl}/admin/factures-societes`);
  }


}
