import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { GenericService } from '../../core/services/generic.service';
import { ContratSousTraitant } from "src/app/models/contrat.models";
interface ContratFilters {
  statutContrat?: string;
  dateDebut?: string;
  dateFin?: string;
  minTjm?: number;
  maxTjm?: number;
}
@Injectable({
  providedIn: "root",
})
export class ContratService extends GenericService<ContratSousTraitant> {

  constructor(protected override http: HttpClient) {
    super(http, "contratsSousTraitant");
  }
  //ajouter un contrat
  addContract(contrat: ContratSousTraitant, fichier: File): Observable<ContratSousTraitant> {
    const formData = this.buildFormData(contrat, fichier);
    return this.http.post<ContratSousTraitant>(`${this.apiUrl}/ajouter`, formData);
  }
  //modifier un contrat
  updateContrat(id: number, contrat: ContratSousTraitant, fichier?: File): Observable<ContratSousTraitant> {
    const formData = this.buildFormData(contrat, fichier);
    return this.http.put<ContratSousTraitant>(`${this.apiUrl}/update/${id}`, formData);
  }
  //récupérer les contrats d'un sous-traitant
  getContratsByConsultant(consultantId: number): Observable<ContratSousTraitant[]> {
    return this.http.get<ContratSousTraitant[]>(`${this.apiUrl}/sous-traitant/${consultantId}`);
  }
  // Télécharger un contrat
  downloadContrat(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: "blob" });
  }

  // Rechercher un contrat avec filtres
  searchContrats(filters: ContratFilters): Observable<ContratSousTraitant[]> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ContratSousTraitant[]>(`${this.apiUrl}/search`, { params });
  }
  //la méthode builFormData pour eviter la duplication
  private buildFormData(contrat: ContratSousTraitant, fichier?: File): FormData {
    const formData = new FormData();
    formData.append("contrat", JSON.stringify(contrat));
    if (fichier) formData.append("fichier", fichier);
    return formData;
  }
  
}
