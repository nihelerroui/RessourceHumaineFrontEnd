import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistoriqueMainOeuvre } from 'src/app/models/historique-mainOeuvre';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueMainOeuvreService extends GenericService<HistoriqueMainOeuvre> {

  constructor(protected http: HttpClient) {
       super(http, 'historique-mainoeuvre'); 
     }

     getHistoriqueByConsultantAndYear(consultantId: number, year: number): Observable<HistoriqueMainOeuvre[]> {
      return this.http.get<HistoriqueMainOeuvre[]>(`${this.apiUrl}/consultant/${consultantId}?year=${year}`);
    }
    
    
}
