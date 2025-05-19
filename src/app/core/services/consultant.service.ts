import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consultant } from 'src/app/models/consultant.models';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService extends GenericService<Consultant> {

  protected baseUrl: string;

  constructor(protected override http: HttpClient) {
    super(http, "consultants");
    this.baseUrl = `${environment.baseUrl}`;
  }

  getBySocieteByConsultant(id: number): Observable<any[]> {
    const headers = new HttpHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/getbysocietebyconsultantPFE/${id}`, { headers });
  }
  
}
