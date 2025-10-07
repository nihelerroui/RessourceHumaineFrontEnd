import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GenericServiceExternalAPIService<T> {

  protected apiUrl: string;

  constructor(protected http: HttpClient, protected endpoint: string) {
    this.apiUrl = `${environment.baseUrl}/${endpoint}`;
  }

  getAll(): Observable<T[]> {
    console.error(this.apiUrl);
    return this.http.get<any[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  
  getOne(id: number): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(item: T): Observable<T> {
    return this.http
      .post<T>(this.apiUrl, item)
      .pipe(catchError(this.handleError));
  }

  update(item: T): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}`, item)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<string> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, {responseType: 'text'})
      .pipe(catchError(this.handleError));
  }

  getBySocieteByConsultant(adminId: number, isCommercial?:boolean): Observable<T[]> {
    if (isCommercial === true) { 
      return this.http
      .get<T[]>(`${this.apiUrl}/commercial/${adminId}`)
      .pipe(catchError(this.handleError));
    } else {
      return this.http
      .get<T[]>(`${this.apiUrl}/getbysocietebyconsultant/${adminId}`)
      .pipe(catchError(this.handleError));  
    }
    
  }

  getByAdminId(adminId: number): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.apiUrl}/admin/${adminId}`)
      .pipe(catchError(this.handleError));
  }
  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later.");
  }
}
