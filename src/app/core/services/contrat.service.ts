import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { GenericService } from '../../core/services/generic.service';
import { ContratSousTraitant } from "src/app/models/contrat.models";

@Injectable({
  providedIn: "root",
})
export class ContratService extends GenericService<ContratSousTraitant> {

  constructor(protected override http: HttpClient) {
    super(http, "contratsSousTraitant"); // Définition de l'endpoint
  }

  // Ajouter un contrat
  addContract(contrat: ContratSousTraitant, fichier: File): Observable<ContratSousTraitant> {
    const formData = new FormData();
    formData.append("contrat", JSON.stringify(contrat));
    formData.append("fichier", fichier);
    return this.http.post<ContratSousTraitant>(`${this.apiUrl}/ajouter`, formData);
  }

  // Modifier un contrat
  updateContrat(id: number, contrat: ContratSousTraitant, fichier?: File): Observable<ContratSousTraitant> {
    const formData = new FormData();
    formData.append("contrat", JSON.stringify(contrat));
    if (fichier) formData.append("fichier", fichier);

    return this.http.put<ContratSousTraitant>(`${this.apiUrl}/update/${id}`, formData);
  }
  //récupérer les contrats d'un sous-traitant
  getContratsByConsultant(consultantId: number): Observable<ContratSousTraitant[]> {
    return this.http.get<ContratSousTraitant[]>(`${this.apiUrl}/sous-traitant/${consultantId}`);
  }
  

  // Télécharger un contrat
  downloadContrat(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: "blob",
    });
  }

  // Rechercher un contrat avec filtres
  searchContrats(filters: any): Observable<ContratSousTraitant[]> {
    let params = new HttpParams();

    if (filters.statutContrat) params = params.set("statutContrat", filters.statutContrat);
    if (filters.dateDebut) params = params.set("dateDebut", filters.dateDebut);
    if (filters.dateFin) params = params.set("dateFin", filters.dateFin);
    if (filters.minTjm !== null) params = params.set("minTjm", filters.minTjm.toString());
    if (filters.maxTjm !== null) params = params.set("maxTjm", filters.maxTjm.toString());

    return this.http.get<ContratSousTraitant[]>(`${this.apiUrl}/search`, { params });
  }
  
}
