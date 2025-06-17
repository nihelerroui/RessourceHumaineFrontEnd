import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommentaireContratClient } from '../../models/commentaire-contratClient.model';
import { GenericService } from './generic.service';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentaireContratClientService extends GenericService<CommentaireContratClient> {
  constructor(protected override http: HttpClient) {
    super(http, 'commentairesContratClient');
  }
  getByContratClientId(contratClientId: number): Observable<CommentaireContratClient[]> {
      return this.http.get<CommentaireContratClient[]>(`${this.apiUrl}/search?contratClientId=${contratClientId}`);
    }
    // Pour le client
  getCommentairesByContratClient(contratClientId: number, token: string): Observable<CommentaireContratClient[]> {
    return this.http.get<CommentaireContratClient[]>(`${this.apiUrl}/client/contrat?contratClientId=${contratClientId}&token=${token}`);
  }

  // Ajout côté client
  addCommentContratClient(commentaire: CommentaireContratClient, token: string): Observable<CommentaireContratClient> {
    return this.http.post<CommentaireContratClient>(`${this.apiUrl}/client/add?token=${token}`, commentaire);
  }

  // Update côté client
  updateCommentContratClient(commentaire: CommentaireContratClient, token: string): Observable<CommentaireContratClient> {
    return this.http.put<CommentaireContratClient>(`${this.apiUrl}/client/update?token=${token}`, commentaire);
  }

  // Suppression côté client
  deleteCommentContratClient(commentaireId: number, token: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/client/delete/${commentaireId}?token=${token}`);
  }
  
}
