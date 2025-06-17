import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentaireFactureClient } from '../../models/CommentaireFactureClient.models';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class CommentaireFactureClientService extends GenericService<CommentaireFactureClient> {
  constructor(http: HttpClient) {
    super(http, 'commentairesFactureClient');
  }

  // Méthode spécifique pour récupérer les commentaires par factureId
  getByFactureId(factureId: number) {
    return this.http.get<CommentaireFactureClient[]>(`${this.apiUrl}/facture/${factureId}`);
  }  
  // ✅ Ajouter un commentaire
  addCommentClient(commentaire: CommentaireFactureClient, token: string): Observable<CommentaireFactureClient> {
    const params = new HttpParams().set('token', token);
    return this.http.post<CommentaireFactureClient>(`${this.apiUrl}/client/add`, commentaire, { params });
  }

  // ✅ Modifier un commentaire
  updateCommentClient(commentaire: CommentaireFactureClient, token: string): Observable<CommentaireFactureClient> {
    const params = new HttpParams().set('token', token);
    return this.http.put<CommentaireFactureClient>(`${this.apiUrl}/client/update`, commentaire, { params });
  }

  // ✅ Supprimer un commentaire
  deleteCommentClient(commentaireId: number, token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.delete(`${this.apiUrl}/client/delete/${commentaireId}`, { params });
  }
  // ✅ Méthode pour récupérer les commentaires en tant que client via token
  getCommentairesByFactureClient(factureId: number, token: string): Observable<CommentaireFactureClient[]> {
    const params = new HttpParams()
      .set('factureId', factureId.toString())
      .set('token', token);

    return this.http.get<CommentaireFactureClient[]>(`${this.apiUrl}/client/facture`, { params });
  }
}

