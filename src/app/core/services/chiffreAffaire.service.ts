import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoriqueChiffreAffaire } from '../../models/HistoriqueChiffreAffaire.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChiffreAffaireService {

  private apiUrl = `${environment.apiUrl}/chiffreAffaire`;

  constructor(private http: HttpClient) {}

  getTotalFactures(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalFactures/${clientId}`);
  }

  getTotalFacturesPayees(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalFacturesPayees/${clientId}`);
  }

  getAllHistorique(): Observable<HistoriqueChiffreAffaire[]> {
    return this.http.get<HistoriqueChiffreAffaire[]>(`${this.apiUrl}`);
  }

}
