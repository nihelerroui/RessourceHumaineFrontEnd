import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FactureSousTraitant } from 'src/app/models/FactureSousTraitant.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FactureSousTraitantService {

  private baseUrl = `${environment.baseUrl}/factureIndep`;

  constructor(private http: HttpClient) {}

  getFacturesAvecMontantTTC(consultantId: number, month: number, year: number): Observable<FactureSousTraitant[]> {
  const url = `${environment.apiUrl}/factureSousTraitant/extraction-ttc?consultantId=${consultantId}&month=${month}&year=${year}`;
  return this.http.get<FactureSousTraitant[]>(url);
}

}
