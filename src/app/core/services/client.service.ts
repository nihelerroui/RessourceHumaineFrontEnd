import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/app/store/client/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8089/spring/clients'; 

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer la liste des clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}`);
  }

  // 🔹 Ajouter un client
  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}`, client);
  }

  // 🔹 Mettre à jour un client
  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}`, client);
  }

  // 🔹 Supprimer un client
  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
