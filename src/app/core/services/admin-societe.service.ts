import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { AdminSociete } from 'src/app/models/adminSociete.model';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Societe } from 'src/app/models/societe.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSocieteService extends GenericService<AdminSociete> {
  constructor(http: HttpClient) {
    super(http, "adminsociete");
  }

  getSocieteByAdmin(adminId: number): Observable<Societe[]> {
    return this.http
      .get<Societe[]>(`${this.apiUrl}/admin/${adminId}`)
      .pipe(catchError(this.handleError));
  }
}
