import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  httpOptions = {
   headers: new HttpHeaders({'Content-Type': 'application/json'})
 };
 apiEndpoint = environment.apiUrl
 constructor(
   private httpClient: HttpClient,
   private tokenStorageService: TokenStorageService,
 ) {
 }

 addTockenToHeaders() {
   const token = this.tokenStorageService.getToken(false);
   this.httpOptions.headers.append('Authorization', token);
 }

getRequest<T>(serviceEndpoint,option = null): Observable<any>{
  // this.addTockenToHeaders();
  return this.httpClient.get<T>(this.apiEndpoint+serviceEndpoint , {...this.httpOptions,...option})
}
deleteRequest<T>(serviceEndpoint,option = null): Observable<any>{
  //this.addTockenToHeaders();
  //todo : revisite le probleme de ok non acceptable
  this.httpOptions.headers.append('Accept', 'application/text');
  return this.httpClient.delete<T>(this.apiEndpoint+serviceEndpoint , {...this.httpOptions,...option})
}

postRequest<T>(serviceEndPoint,body,option = null): Observable<any>{
  return this.httpClient.post<T>(this.apiEndpoint+serviceEndPoint, body,{...this.httpOptions,...option});
}

putRequest<T>(serviceEndPoint,body,option = null):Observable<any>{
  return this.httpClient.put<T>(this.apiEndpoint+serviceEndPoint, body,{...this.httpOptions,...option});
}

addRequestParam(params :{key:string,value}[]){
   let paramListAsURL =""
  params.map(param=>{
    paramListAsURL+=`${param.key}=${param.value}&`
  })
  return paramListAsURL.substring(0,paramListAsURL.length-1)
}

}

