import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ContratClient } from "../../store/contratClient/contratClient.models";

@Injectable({
  providedIn: "root",
})
export class ContratClientService {
  private apiUrl = "http://localhost:8089/spring/contratsClient";

  constructor(private http: HttpClient) {}

  // Charger tous les contrats client
  getAllContrats(): Observable<ContratClient[]> {
    return this.http.get<ContratClient[]>(`${this.apiUrl}`);
  }

  // Importer un contrat client
  importerContrat(file: File, token: string, designation: string, tjm: number): Observable<ContratClient> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append("designation", designation);
    formData.append("tjm", tjm.toString());
  
    console.log("📡 Token envoyé :", token);
  
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.post<ContratClient>(`${this.apiUrl}/importer`, formData, { headers }).pipe(
      tap(response => console.log("📡 Réponse reçue du backend :", response)),
      catchError(error => {
        console.error("❌ Erreur lors de l'importation :", error);
        return throwError(() => error);
      })
    );
  }
  
  
}
