import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FactureSousTraitant } from 'src/app/models/FactureSousTraitant.model';


@Injectable({
  providedIn: 'root'
})
export class FactureSousTraitantService {

  private baseUrl = 'https://featway-serveur.fr:8181/portail-backend-dev/api/factureIndep';

  constructor(private http: HttpClient) {}

  getFactures(consultantId: number, month: number, year: number, token: string): Observable<FactureSousTraitant[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.baseUrl}/consultantMonthYear?consultant_id=${consultantId}&month=${month}&year=${year}`;

    return this.http.get<FactureSousTraitant[]>(url, { headers });
  }
}
