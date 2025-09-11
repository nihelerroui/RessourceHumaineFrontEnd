import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainOeuvre } from 'src/app/models/mainOeuvre.model';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainOeuvreService extends GenericService<MainOeuvre> {

 constructor(protected http: HttpClient) {
     super(http, 'mainoeuvre'); 
   }

   verifierMiseAJour(adminId: number, mois: number, annee: number): Observable<any> {
    const payload = { adminId, mois, annee };
    return this.http.post(`${this.apiUrl}/verifier-mise-a-jour`, payload, {
      responseType: 'text'
    });
  }
  
  
  
  }
