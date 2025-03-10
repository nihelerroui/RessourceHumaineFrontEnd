import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericService } from './generic.service'; // Import GenericService
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestationService extends GenericService<any> {
  // The constructor passes 'prestations' as the dynamic endpoint to the GenericService
  constructor(http: HttpClient) {
    super(http, 'prestations'); // 'prestations' will be used as the dynamic endpoint
  }

  // Create Prestation: custom endpoint remains the same
  createPrestation(prestationDTO: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, prestationDTO); // Custom route for creation
  }

  // Use the custom update method (kept as is)
  updatePrestation(prestationDTO: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, prestationDTO); // Custom route for update
  }
}
