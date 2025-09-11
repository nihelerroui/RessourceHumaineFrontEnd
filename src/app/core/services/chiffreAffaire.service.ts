import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HistoriqueChiffreAffaire } from '../../models/HistoriqueChiffreAffaire.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ChiffreAffaireService extends GenericService<HistoriqueChiffreAffaire>{

  constructor(protected http: HttpClient) {
    super(http, 'chiffreAffaire');
  }

  getTotalFactures(clientId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalFactures/${clientId}`);
  }

 getTotalFacturesPayees(clientId: number): Observable<number> {
  return this.http.get<any>(`${this.apiUrl}/totalFacturesPayees/${clientId}`).pipe(
    map(res => res.montantTotalPayees ?? 0)
  );
}
 getChiffreAffaireDeuxDernieresAnnees(): Observable<{ caAnneePrecedente: number, caDeuxAnsAvant: number }> {
  return this.http.get<{ caAnneePrecedente: number, caDeuxAnsAvant: number }>(
    `${this.apiUrl}/ChiffreAffaireDeuxDernieresAnnees`
  );
}
getChiffreAffaireParClient(clientId: number): Observable<number> {
  return this.http.get<any>(`${this.apiUrl}/chiffreAffaireHistoriqueClient/${clientId}`).pipe(
    map(res => res.montant ?? 0)
  );
}
}
