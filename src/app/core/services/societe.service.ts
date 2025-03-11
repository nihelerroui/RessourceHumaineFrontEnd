import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Societe } from 'src/app/models/societe.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SocieteService extends GenericService<Societe>{

  constructor(protected http: HttpClient) {
    super(http, 'societes'); 
  }

  
}
