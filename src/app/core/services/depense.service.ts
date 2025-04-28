import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class DepenseService extends GenericService<any> {

  constructor(protected http: HttpClient) {
    super(http, 'depenses');
  }
}