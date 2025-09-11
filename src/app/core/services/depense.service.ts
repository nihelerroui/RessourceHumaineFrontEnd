import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Depense } from 'src/app/models/depense.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepenseService extends GenericService<Depense> {

  constructor(protected http: HttpClient) {
    super(http, 'depenses');
  }

  getDepensesBySociete(societeId: number): Observable<Depense[]> {
  return this.http.get<Depense[]>(`${this.apiUrl}/by-societe/${societeId}`);
}

}