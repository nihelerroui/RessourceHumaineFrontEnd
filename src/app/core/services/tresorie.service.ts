import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GenericService } from "./generic.service";
import { Tresorie } from "src/app/models/tresorie.model";
import { ScoreSante } from "src/app/models/ScoreSante.model";
import { Diagnostic } from "src/app/models/Diagnostic.model";

@Injectable({
  providedIn: "root",
})
export class TresorieService extends GenericService<Tresorie> {
  constructor(protected http: HttpClient) {
    super(http, "tresories");
  }

  getTresorie(societeId: number): Observable<Tresorie> {
    return this.http.get<Tresorie>(`${this.apiUrl}/societe/${societeId}`);
  }

  setSoldeInitial(societeId: number, montant: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solde-initial`, {
      societeId,
      montant,
    });
  }

  augmenterSoldeActuel(
    societeId: number,
    montant: number,
    source: string,
    motif: string
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/augmenter-solde`, {
      societeId,
      montant,
      source,
      motif,
    });
  }

  validerPaiement(factureId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/valider-paiement`, factureId, {
      headers: { "Content-Type": "application/json" },
    });
  }

  getScoreSante(
    societeId: number,
    debut: string,
    fin: string
  ): Observable<ScoreSante> {
    return this.http.get<ScoreSante>(
      `${this.apiUrl}/sante-financiere?societeId=${societeId}&debut=${debut}&fin=${fin}`
    );
  }

  getDiagnostic(
    societeId: number,
    debut: string,
    fin: string
  ): Observable<Diagnostic> {
    return this.http.get<Diagnostic>(
      `${this.apiUrl}/diagnostic-financier?societeId=${societeId}&debut=${debut}&fin=${fin}`
    );
  }
}
