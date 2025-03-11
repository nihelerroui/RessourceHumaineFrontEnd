import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TresorieService {

  private apiUrl = 'http://localhost:8089/spring/tresories';

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer le solde actuel de la trésorerie d'une société
  getSoldeActuel(societeId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/solde-actuel/${societeId}`);
  }

  // 🔹 Définir le solde initial de la trésorerie
  setSoldeInitial(societeId: number, montant: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solde-initial/${societeId}?montant=${montant}`, {});
  }

  // 🔹 Valider le paiement d'une facture
  validerPaiement(factureId: number): Observable<any> {
    const body = { factureId };
    console.log("Body envoyé à l'API :", JSON.stringify(body)); // Debug
  
    return this.http.post<any>('http://localhost:8089/spring/tresories/valider-paiement', body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  
}
