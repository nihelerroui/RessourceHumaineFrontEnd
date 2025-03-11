import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  // Adjust the path based on your environment file

@Injectable({
  providedIn: 'root',
})
export class GenericService<T> {

    protected apiUrl: string;

  constructor(protected http: HttpClient, protected endpoint: string) {
    this.apiUrl = `${environment.apiUrl}/${endpoint}`;
  }

  // Generic method to get all data from an endpoint
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  // Generic method to get a single record by ID
  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  // Generic method to create a new record
  create(data: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, data);
  }

  // Generic method to update a record by ID
  update(id: string, data: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, data);
  }

  // Generic method to delete a record by ID
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}