import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Societe } from 'src/app/models/societe.model';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocieteService extends GenericService<Societe>{

  constructor(protected http: HttpClient) {
    super(http, 'societes'); 
  }
  getSocietesAdministrees(): Observable<Societe[]> {
  return this.http.get<Societe[]>(`${this.apiUrl}/administre`);
}

  
}
