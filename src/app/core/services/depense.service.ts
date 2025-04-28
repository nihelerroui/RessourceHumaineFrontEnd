import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Depense } from 'src/app/models/depense.model';

@Injectable({
  providedIn: 'root',
})
export class DepenseService extends GenericService<Depense> {

  constructor(protected http: HttpClient) {
    super(http, 'depenses');
  }
}