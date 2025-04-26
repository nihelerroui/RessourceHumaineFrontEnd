import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}

