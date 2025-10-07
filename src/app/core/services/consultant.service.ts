import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Consultant } from 'src/app/models/consultant.models';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { GenericServiceExternalAPIService } from './generic-service-external-api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService extends GenericServiceExternalAPIService<Consultant> {

  protected baseUrl: string;

  constructor(protected override http: HttpClient) {
    super(http, "consultant"); }

 
  getConsultantByMail(email: string): Observable<Consultant> {
    return this.http
      .get<Consultant>(`${this.apiUrl}/email?email=${email}`)
      .pipe(catchError(this.handleError));
  }
  
}
