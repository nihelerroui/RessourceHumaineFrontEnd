import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends GenericService<Client> {

  constructor(protected http: HttpClient) {
    super(http, 'clients'); 
  }

}
