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
  //récupérer les commentaires d’un contrat client
  getByContratClientId(contratClientId: number): Observable<CommentaireContratClient[]> {
    return this.http.get<CommentaireContratClient[]>(`${this.apiUrl}/search?contratClientId=${contratClientId}`);
  }
  
}
