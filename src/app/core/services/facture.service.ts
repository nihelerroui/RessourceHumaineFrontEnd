import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Facture } from 'src/app/models/facture.model';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService extends GenericService<Facture> {

  constructor(protected http: HttpClient) {
    super(http, 'factures'); 
  }

  createFacture(formData: FormData): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}/create`, formData);
  }
  
  updateFacture(formData: FormData): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/update`, formData);
  }
  
  getFileUrl(filename: string, disposition: 'inline' | 'attachment' = 'inline'): string {
    return `${this.apiUrl}/files/${filename}?disposition=${disposition}`;
  }
  
}
