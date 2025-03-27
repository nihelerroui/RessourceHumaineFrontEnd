import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ContratClient } from "../../models/contratClient.models";
import { GenericService } from "../../core/services/generic.service";

@Injectable({
  providedIn: "root",
})
export class ContratClientService extends GenericService<ContratClient> {
  constructor(protected http: HttpClient) {
    super(http, "contratsClient");
  }

  // Importer un contrat client
  importerContrat(
    file: File,
    token: string,
    designation: string,
    tjm: number
  ): Observable<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append("designation", designation);
    formData.append("tjm", tjm.toString());

    console.log("📡 Envoi FormData vers API :", formData);

    return this.http.post(`${this.apiUrl}/importer`, formData, { responseType: 'text' }).pipe(
      tap((token: string) => {
        console.log("✅ Contrat importé avec token :", token);
        // redirection ici si besoin
      }),
      catchError((error) => {
        console.error("❌ Erreur lors de l'importation :", error);
        return throwError(() => new Error(error.message || "Erreur inconnue"));
      })
    );
    
  }

  consulterContratsClient(token: string): Observable<ContratClient[]> {
    return this.http
      .get<ContratClient[]>(`${this.apiUrl}/liste?token=${token}`)
      .pipe(
        tap((contrats) => console.log("✅ Contrats récupérés :", contrats)),
        catchError((error) => {
          console.error("Erreur lors de la récupération des contrats :", error);
          return throwError(
            () => new Error(error.message || "Erreur inconnue")
          );
        })
      );
  }
}
