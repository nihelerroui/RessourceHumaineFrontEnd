import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ContratClient } from "../../models/contratClient.models";
import { GenericService } from "../../core/services/generic.service";

@Injectable({
  providedIn: "root",
})
export class ContratClientService extends GenericService<ContratClient> {

  constructor(protected override http: HttpClient) {
    super(http, "contratsClient");
  }

  importerContrat(file: File, clientId: number, designation: string, tjm: number): Observable<ContratClient> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("clientId", clientId.toString());
    formData.append("designation", designation);
    formData.append("tjm", tjm.toString());

    return this.http.post<ContratClient>(`${this.apiUrl}/importer`, formData);
  }
  consulterContratsClientParId(clientId: number): Observable<ContratClient[]> {
    return this.http.get<ContratClient[]>(`${this.apiUrl}/liste?clientId=${clientId}`).pipe(
      tap(contrats => console.log("✅ Contrats par clientId récupérés :", contrats)),
      catchError(error => {
        console.error("❌ Erreur récupération contrats :", error);
        return throwError(() => new Error(error.message || "Erreur inconnue"));
      })
    );
  }
  getContratsBySocietesAdmin(): Observable<ContratClient[]> {
    console.log("📡 Appel du service Angular vers backend pour contrats admin");
    return this.http.get<ContratClient[]>(`${this.apiUrl}/admin/contrats-societes`);
  }
  getNombreContratsRealises(clientId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/realises?clientId=${clientId}`);
  }

}