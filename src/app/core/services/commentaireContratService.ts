import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommentaireContrat } from '../../models/commentaire-contrat.model';
import { GenericService } from './generic.service';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentaireContratService extends GenericService<CommentaireContrat> {
  constructor(protected override http: HttpClient) {
    super(http, 'commentairesContrat');
  }

  //récupérer les commentaires d’un contrat client
  getCommentairesByContrat(id: number, isSousTraitant: boolean = false): Observable<CommentaireContrat[]> {
    const param = isSousTraitant ? 'contratSTId' : 'contratClientId';
  
    return this.http.get<CommentaireContrat[]>(
      `${this.apiUrl}/search?${param}=${id}`
    ).pipe(
      tap(data => console.log('Commentaires récupérés pour contrat:', data)),
      catchError(error => {
        console.error('Erreur getCommentairesByContrat:', error);
        return throwError(() => new Error('Erreur récupération commentaires'));
      })
    );
  }
  
  addCommentaireClient(commentaire: CommentaireContrat, token: string): Observable<CommentaireContrat> {
    return this.http.post<CommentaireContrat>(
      `${this.apiUrl}/client/add?token=${token}`, commentaire
    );
  }
  
}
