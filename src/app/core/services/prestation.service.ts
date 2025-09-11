import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { Prestation } from '../../models/prestation.model';

@Injectable({
  providedIn: 'root'
})
export class PrestationService extends GenericService<Prestation> {
  constructor(protected override http: HttpClient) {
    super(http, 'prestations');
  }
  createPrestation(prestationDTO: any): Observable<Prestation> {
    return this.http.post<Prestation>(`${this.apiUrl}/create`, prestationDTO);
  }
  updatePrestation(prestationDTO: any): Observable<Prestation> {
    return this.http.put<Prestation>(`${this.apiUrl}/update`, prestationDTO);
  }
  deletePrestation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
