import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { FactureSousTraitant } from "src/app/models/FactureSousTraitant.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FactureSousTraitantService {
  private baseUrl = `${environment.baseUrl}/factureIndep`;

  constructor(private http: HttpClient) {}

  getFacturesAvecMontantTTC(
    consultantId: number,
  ): Observable<FactureSousTraitant[]> {
    const url = `${environment.apiUrl}/factureSousTraitant/consultant?consultantId=${consultantId}`;
    return this.http.get<FactureSousTraitant[]>(url);
  }

  validerPaiement(factureId: number): Observable<any> {
    return this.http.put<any>(
      `${environment.apiUrl}/factureSousTraitant/valider-paiement/${factureId}`,
      null,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
