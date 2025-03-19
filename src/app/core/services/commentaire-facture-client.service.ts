import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service'; // Import GenericService
import { CommentaireFactureClient } from '../../shared/models/commentairefactureclient.model';

@Injectable({
  providedIn: 'root'
})
export class CommentaireFactureClientService extends GenericService<CommentaireFactureClient> {
  constructor(http: HttpClient) {
    super(http, 'commentairesFactureClient');
  }

  getAllCommentaires(): Observable<CommentaireFactureClient[]> {
    return this.http.get<CommentaireFactureClient[]>(`${this.apiUrl}`);
  }

  createCommentaire(commentaireDTO: any): Observable<CommentaireFactureClient> {
    return this.http.post<CommentaireFactureClient>(`${this.apiUrl}/create`, commentaireDTO);
  }

  getCommentairesByFacture(factureClientId: number): Observable<CommentaireFactureClient[]> {
    return this.http.get<CommentaireFactureClient[]>(`${this.apiUrl}/facture/${factureClientId}`);
  }

  deleteCommentaire(commentaireId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentaireId}`);
  }
  updateCommentaire(commentaireId: number, dto: any): Observable<CommentaireFactureClient> {
    return this.http.put<CommentaireFactureClient>(`${this.apiUrl}/update/${commentaireId}`, dto);
  }
}
