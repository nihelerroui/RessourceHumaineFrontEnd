import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { Tresorie } from 'src/app/models/tresorie.model';

@Injectable({
  providedIn: 'root'
})
export class TresorieService extends GenericService<Tresorie> {

  constructor(protected http: HttpClient) {
    super(http, 'tresories'); 
  }

  getTresorie(societeId: number): Observable<Tresorie> {
    return this.http.get<Tresorie>(`${this.apiUrl}/societe/${societeId}`);
  }
  

  // 🔹 Définir le solde initial de la trésorerie
  setSoldeInitial(societeId: number, montant: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solde-initial/${societeId}`, { montant });
  }

  augmenterSoldeActuel(societeId: number, montant: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/augmenter-solde/${societeId}?montant=${montant}`, {});
  }
  

  // 🔹 Valider le paiement d'une facture
  validerPaiement(factureId: number): Observable<any> {
    const body = { factureId };
    console.log("Body envoyé à l'API :", JSON.stringify(body)); // Debug
  
    return this.http.post<any>(`${this.apiUrl}/valider-paiement`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  
}
