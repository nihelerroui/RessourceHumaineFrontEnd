import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pays } from 'src/app/pages/models/pays.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PaysService extends GenericService<Pays> {

  constructor(protected http: HttpClient) {
    super(http, 'pays'); // 'pays' est l'endpoint spécifique pour les pays
  }

}
