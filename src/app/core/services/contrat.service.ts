import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ContratSousTraitant } from "src/app/store/contrat/contrat.models";

@Injectable({
  providedIn: "root",
})
export class ContratService {
  private apiUrl = "http://localhost:8089/spring/contratsSousTraitant";

  constructor(private http: HttpClient) {}

  getContracts(): Observable<ContratSousTraitant[]> {
    return this.http.get<ContratSousTraitant[]>(`${this.apiUrl}`);
  }

  addContract(
    contrat: ContratSousTraitant,
    fichier: File
  ): Observable<ContratSousTraitant> {
    const formData = new FormData();
    formData.append("contrat", JSON.stringify(contrat));
    formData.append("fichier", fichier);
    return this.http.post<ContratSousTraitant>(
      `${this.apiUrl}/ajouter`,
      formData
    );
  }
  deleteContrat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  downloadContrat(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: "blob",
    });
  }
  // Modifier un contrat
  updateContrat(
    id: number,
    contrat: ContratSousTraitant,
    fichier?: File
  ): Observable<ContratSousTraitant> {
    const formData = new FormData();
    formData.append("contrat", JSON.stringify(contrat));
    if (fichier) formData.append("fichier", fichier);

    return this.http.put<ContratSousTraitant>(
      `${this.apiUrl}/update/${id}`,
      formData
    );
  }
}
