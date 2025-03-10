import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Societe } from 'src/app/store/societe/societe.models';

@Injectable({
  providedIn: 'root'
})
export class SocieteService {

  private apiUrl = 'http://localhost:8089/spring/societes';

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer la liste des sociétés
  getSocietes(): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${this.apiUrl}`);
  }

  // 🔹 Ajouter une société
  addSociete(societe: Societe): Observable<Societe> {
    return this.http.post<Societe>(`${this.apiUrl}`, societe);
  }

  // 🔹 Mettre à jour une société
  updateSociete(societe: Societe): Observable<Societe> {
    return this.http.put<Societe>(`${this.apiUrl}`, societe);
  }

  // 🔹 Supprimer une société
  deleteSociete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
