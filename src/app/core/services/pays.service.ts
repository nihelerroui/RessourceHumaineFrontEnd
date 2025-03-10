import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pays } from 'src/app/store/pays/pays.models';

@Injectable({
  providedIn: 'root'
})
export class PaysService {

  private apiUrl = 'http://localhost:8089/spring/pays'; 

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer la liste des pays
  getPays(): Observable<Pays[]> {
    return this.http.get<Pays[]>(`${this.apiUrl}`);
  }

  // 🔹 Ajouter un pays
  addPays(pays: Pays): Observable<Pays> {
    return this.http.post<Pays>(`${this.apiUrl}`, pays);
  }

  // 🔹 Mettre à jour un pays
  updatePays(pays: Pays): Observable<Pays> {
    return this.http.put<Pays>(`${this.apiUrl}`, pays);
  }

  // 🔹 Supprimer un pays
  deletePays(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
