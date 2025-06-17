import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { CommentaireContratSousTraitant } from 'src/app/models/commentaire-contratSousTraitant.model';
@Injectable({
  providedIn: 'root',
})
export class CommentaireContratSousTraitantService  extends GenericService<CommentaireContratSousTraitant> {
  constructor(protected override http: HttpClient) {
    super(http, 'commentairesContratSousTraitant');
  }
  getByContratSousTraitantId(contratSTId: number): Observable<CommentaireContratSousTraitant[]> {
    return this.http.get<CommentaireContratSousTraitant[]>(`${this.apiUrl}/search?contratSTId=${contratSTId}`);
  }
}