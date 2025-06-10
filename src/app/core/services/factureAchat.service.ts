import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FactureAchat } from 'src/app/models/factureAchat.model';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureAchatService extends GenericService<FactureAchat> {

  constructor(protected http: HttpClient) {
    super(http, 'facturesAchats'); 
  }

  createFacture(formData: FormData): Observable<FactureAchat> {
    return this.http.post<FactureAchat>(`${this.apiUrl}/create`, formData);
  }
  
  updateFacture(formData: FormData): Observable<FactureAchat> {
    return this.http.put<FactureAchat>(`${this.apiUrl}/update`, formData);
  }
  
  getFileUrl(filename: string, disposition: 'inline' | 'attachment' = 'inline'): string {
    return `${this.apiUrl}/files/${filename}?disposition=${disposition}`;
  }
  
}
