import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ContratClient } from "../../models/contratClient.models";
import { GenericService } from '../../core/services/generic.service';

@Injectable({
  providedIn: "root",
})
export class ContratClientService extends GenericService<ContratClient> {

  constructor(protected http: HttpClient) {
    super(http, "contratsClient"); // Spécifie l'endpoint
  }

  // Importer un contrat client (Méthode spécifique à ce service)
  importerContrat(file: File, token: string, designation: string, tjm: number): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append("designation", designation);
    formData.append("tjm", tjm.toString());

    console.log("📡 Envoi FormData vers API :", formData);

    return this.http.post(`${this.apiUrl}/importer`, formData, { responseType: 'text' as 'json' }).pipe(
      tap(response => console.log("📡 Réponse reçue du backend :", response))
    );
  }
}
