import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Facture } from 'src/app/models/facture.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class FactureService extends GenericService<Facture> {

  constructor(protected http: HttpClient) {
    super(http, 'factures'); 
  }
}
