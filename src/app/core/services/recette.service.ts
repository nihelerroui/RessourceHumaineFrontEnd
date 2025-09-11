import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Recette } from 'src/app/models/recette.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetteService extends GenericService<Recette> {

  constructor(protected http: HttpClient) {
    super(http, 'recettes'); 
  }

  getRecettesBySociete(societeId: number): Observable<Recette[]> {
  return this.http.get<Recette[]>(`${this.apiUrl}/by-societe/${societeId}`);
}

  
}
